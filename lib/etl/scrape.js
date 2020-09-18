import {GAMER_MATCH_TABLE, GAMER_TABLE, MATCH_TABLE, MIN_MAX_TIMESTAMPS_VIEW} from "../constants";
import WarzoneMapper from './mapper';
import Bluebird from 'bluebird';
import {insertIntoDatabase, getTimestampList, queryDatabase, sleep} from './utils';
import apiLib from 'call-of-duty-api';
const API = apiLib({ratelimit: {maxRequests: 1, perMilliseconds: 10000, maxRPS: 1}});
let EMAIL = process.env.WARZONE_EMAIL;
let PASSWORD = process.env.WARZONE_PASSWORD;


/***
 Hits the Call of Duty API for the entire match history. Is limited to the most recent 1000 games.
 Also queries for the MIN and MAX timestamps that we already have in the database
 * @param gamer -- the gamer we are querying for
 * @param api -- the already authenticated API
 * @param IS_BACKFILL -- whether we want to try to backfill all of history or just the most recent
 * @returns {Promise<{gamer, matchHistory, queriedTimestamps, isBackfill}>}
 */
function getMatchHistory(gamer, api, IS_BACKFILL = false) {
    console.log('querying history for gamer:' + gamer.username + ' on platform:' + gamer.platform);
    console.log('IS_BACKFILL is set to ' + IS_BACKFILL);
    return api.MWfullcombatwz(gamer.username, gamer.platform).then((output) => {
        return queryDatabase(MIN_MAX_TIMESTAMPS_VIEW, {query_username: gamer.username, query_platform: gamer.platform}).then((minMaxTimestamps) => {
            let queriedTimestamps = minMaxTimestamps[0] || {};
            console.log('found history for gamer:' + gamer.username + ' on platform:' + gamer.platform);
            console.log('game history of size:' + output.length);
            return {
                gamer: gamer,
                matchHistory: output,
                queriedTimestamps: queriedTimestamps,
                isBackfill: IS_BACKFILL
            }
        })
    }).catch((err) => {
        console.log(err);
    });
}


/**
 * This function takes the response from getMatchHistory and transform it into time frames
 * that return at most 20 games at a time.
 * @param object
 * @returns {[] -- an array of valid time frames}
 */
function getQueryTimeframes(object){
    let {matchHistory, queriedTimestamps, isBackfill} = object;
    let timestampList = getTimestampList(matchHistory, 'timestamp');
    if (queriedTimestamps.last_timestamp && !isBackfill) {
        timestampList = timestampList.filter(
            (item) => item.end > parseFloat(object.queriedTimestamps.last_timestamp) * 1000)
    }
    return timestampList
}


/**
 * This takes the response from getMatchHistory and queries the API again for each 20 game valid timeframe
 * It then inserts all those matches into the database,
 * both into the warzone.gamer_matches and warzone.matches tables
 * @param object
 * @param api
 * @returns {*}
 */
function getMatchDetails(object, api) {
    let timestampList = getQueryTimeframes(object);
    let {gamer} = object;
    console.log('# of Details API calls needed for gamer:' + gamer.username + ' on platform:' + gamer.platform + ': ' + timestampList.length);
    console.log("getting match details for: " + gamer.username + ' on platform:' + gamer.platform)
    return Bluebird.mapSeries(timestampList, (item) => {
        return api.MWcombatwzdate(object.gamer.username, item.start, item.end, object.gamer.platform).then((output) => {
            let matches = output.matches || [];
            sleep(7 * 1000)
            console.log('Num matches for interval:' + matches.length);
            return writeMatchesToDatabase(matches, gamer);
        });
    });
}



/**
 * Takes a list of matches from the getMatchDetails API calls and writes them both
 * into the warzone.gamer_matches and warzone.matches tables
 * @param matches
 * @param gamer
 * @returns {PromiseLike<any> | Promise<any>}
 */
function writeMatchesToDatabase(matches, gamer){
    let mappedMatches = matches.map(WarzoneMapper.mapMatch);
    let matchPromises = mappedMatches.map((m) => insertIntoDatabase(m, MATCH_TABLE));
    let gamerMatches = matches.map((match) => WarzoneMapper.mapGamerMatch(match, gamer)).filter((match) => match.match_id && match.username);
    return Bluebird.all(matchPromises).then(() => {
        let gamerMatchPromises = gamerMatches.map((m) => insertIntoDatabase(m, GAMER_MATCH_TABLE));
        return Bluebird.all(gamerMatchPromises);
    });
}


/**
 *
 * Function that does the following:
 *
 * 1. Logs into the API
 * 2. Gets the match history for the gamer passed in
 * 3. Queries any necessary match details data to update
 * 4. Finishes and returns.
 * @param gamer
 * @param IS_BACKFILL
 * @returns {Promise<{gamer, matchHistory, queriedTimestamps, isBackfill}>}
 */
function executePipeline(gamer, IS_BACKFILL = false) {
    return API.login(EMAIL, PASSWORD)
        .then(() => getMatchHistory(gamer, API, IS_BACKFILL)
        .then((matches) => getMatchDetails(matches, API))
        .then((data)=> {
            console.log("done getting data for " + gamer.username + " on platform:" + gamer.platform);
            return data;
        })
    );
}


/**
 * First queries the gamers table,
 * then executes the pipeline for each gamer
 * IS_BACKFILL, when true, will try to insert the entire history for each gamer return
 * @param query
 * @param IS_BACKFILL
 * @returns {PromiseLike<void>}
 */
export function refreshData(query = {}, IS_BACKFILL = false) {
    return queryDatabase(GAMER_TABLE, query)
        .then((gamers) =>  Bluebird.mapSeries(gamers, (gamer)=> executePipeline(gamer, IS_BACKFILL)))
        .then(() => console.log("Finished entire refresh"));
}