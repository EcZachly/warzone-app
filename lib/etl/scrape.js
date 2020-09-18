import Bluebird from 'bluebird';
import {getTimestampList} from './utils';
import {queryGamers} from '../model/gamers';
import {getMatchDetailsFromAPI, getMinMaxMatchTimestamps} from '../model/matches';
import {login} from '../api_wrapper';

/***
 Hits the Call of Duty API for the entire match history. Is limited to the most recent 1000 games.
 Also queries for the MIN and MAX timestamps that we already have in the database
 * @param gamer -- the gamer we are querying for
 * @param api -- the already authenticated API
 * @param IS_BACKFILL -- whether we want to try to backfill all of history or just the most recent
 * @returns {Promise<{gamer, matchHistory, queriedTimestamps, isBackfill}>}
 */
async function getMatchHistory(gamer, api, IS_BACKFILL = false) {
    console.log('querying history for gamer:' + gamer.username + ' on platform:' + gamer.platform);
    console.log('IS_BACKFILL is set to ' + IS_BACKFILL);
    try {
        let output = await api.MWfullcombatwz(gamer.username, gamer.platform);
        let queriedTimestamps = await getMinMaxMatchTimestamps(gamer);
        console.log('found history for gamer:' + gamer.username + ' on platform:' + gamer.platform);
        console.log('game history of size:' + output.length);
        return {
            gamer: gamer,
            matchHistory: output,
            queriedTimestamps: queriedTimestamps,
            isBackfill: IS_BACKFILL
        }
    }
    catch(e){
        console.log(e);
    }
}


/**
 * This function takes the response from getMatchHistory and transform it into time frames
 * that return at most 20 games at a time.
 * @param object
 * @returns {[] -- an array of valid time frames}
 */
async function getQueryTimeframes(object) {
    let {matchHistory, queriedTimestamps, isBackfill} = object;
    let timestampList = getTimestampList(matchHistory, 'timestamp');
    if (queriedTimestamps.last_timestamp && !isBackfill) {
        timestampList = timestampList.filter(
            (item) => item.end > parseFloat(object.queriedTimestamps.last_timestamp) * 1000)
    }
    return Bluebird.resolve({timestampList: timestampList, gamer: object.gamer});
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
async function executePipeline(gamer, API, IS_BACKFILL = false) {
    let history = await getMatchHistory(gamer, API, IS_BACKFILL);
    let object = await getQueryTimeframes(history);
    let details = await getMatchDetailsFromAPI(object, API);

    console.log("done getting data for " + gamer.username + " on platform:" + gamer.platform);
    return details;
}


/**
 * First queries the gamers table,
 * then executes the pipeline for each gamer
 * IS_BACKFILL, when true, will try to insert the entire history for each gamer return
 * @param query
 * @param IS_BACKFILL
 * @returns {PromiseLike<void>}
 */
export async function refreshData(query = {}, IS_BACKFILL = false) {
    let API = await login();
    let gamers = await queryGamers(query);
    return Bluebird.mapSeries(gamers, (gamer) => executePipeline(gamer, API, IS_BACKFILL)).then(()=>{
        console.log("Finished entire refresh")
    })
}