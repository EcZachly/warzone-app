import Bluebird from 'bluebird';

import WarzoneMapper from '../etl/mapper';
import {insertDatabaseValues, queryDatabase, refreshMaterializedView} from '../database_utils';
import {
    TABLES,
    VIEWS,
    MATCH_DETAILS_SLEEP_TIME
} from '../constants';
import ApiWrapper from '../api_wrapper';

import UtilityService from './../../src/services/UtilityService';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



/**
 * Takes a list of gamer matches from the getMatchDetails API calls and writes it into the warzone.gamer_matches
 * @param matches
 * @param gamer
 * @returns {PromiseLike<any> | Promise<any>}
 */
export function writeGamerMatchesToDatabase(matches, gamer) {
    const gamerMatches = matches.map((match) => WarzoneMapper.mapGamerMatch(match, gamer)).filter((match) => match.match_id && match.username);
    const gamerMatchPromises = gamerMatches.map(async (m) => {
        let {match_id, uno_id } = m;
        let query_username = gamer.username;
        let query_platform = gamer.platform;
        if(query_username == '-'){
           query_username = uno_id;
           query_platform = 'uno';
        }
        let upsertQuery = {query_username, query_platform, match_id};
        return await insertDatabaseValues(m, TABLES.GAMER_MATCHES, upsertQuery);
    });
    return Bluebird.all(gamerMatchPromises, {concurrency: 3});
}


/**
 * Takes a list of matches from the getMatchDetails API calls and writes it into warzone.matches table
 * @param matches
 * @returns {PromiseLike<any> | Promise<any>}
 */
export function writeMatchesToDatabase(matches) {
    const mappedMatches = matches.map(WarzoneMapper.mapMatch);
    const matchPromises = mappedMatches.map((m) => insertDatabaseValues(m, TABLES.MATCHES));
    return Bluebird.all(matchPromises);
}


/**
 * Takes in a gamer and returns the first and last timestamps of matches they've played currently existing in the
 * database
 * @param gamer
 * @returns {*}
 */
export async function getMinMaxMatchTimestamps(gamer) {
    const gamers = await queryDatabase(VIEWS.MIN_MAX_TIMESTAMPS_VIEW, {
        query_username: gamer.username,
        query_platform: gamer.platform
    });

    return gamers[0] || {};
}

/**
 * It queries the Call Of Duty Api for each time frame in the queryTimeframes
 * @param queryTimeframes
 * @param gamer
 * @param api
 * @param sleepTime
 * @returns {*}
 */
export async function getMatchDetailsFromAPI(queryTimeframes, gamer, api, sleepTime = MATCH_DETAILS_SLEEP_TIME) {
    const gamerID = [gamer.platform, gamer.username].join('-');

    console.log(gamerID + ': Getting match details');
    console.log(gamerID + ': # of match details API calls needed: ' + queryTimeframes.length);

    const matches = await Bluebird.mapSeries(queryTimeframes, async (item, index) => {
        const output = await api.MWcombatwzdate(gamer.username, item.start, item.end, gamer.platform);
        const matches = UtilityService.validateItem(output.matches, 'array', []);

        console.log(`${gamer.platform}-${gamer.username}: ${index + 1} of ${queryTimeframes.length}, getting ${matches.length} match details from API`);

        UtilityService.sleep(sleepTime);

        return matches;
    });

    console.log(gamerID + ': completed getting match details');

    return UtilityService.validateItem(matches, 'array', []).flatMap((matchArr) => matchArr);
}

export async function getFullMatchDetailsFromAPI(match_id){
    let callApi =  await ApiWrapper.getInstance();
   let data = await callApi.MWFullMatchInfowz(match_id);
   return data.allPlayers
}





export async function queryMatches(query, options = {}) {
    query = UtilityService.validateItem(query, 'object', {});
    return queryDatabase(TABLES.MATCHES, query, options);
}


export async function refreshMatchAnalytics(){
    const viewsToRefresh = [
        VIEWS.PLAYER_STAT_SUMMARY
    ].map((view) => view + '_materialized');
    return Bluebird.all(viewsToRefresh.map((view)=> refreshMaterializedView(view)))
}


export async function initializeMatches(gamer) {
    const API = await ApiWrapper.getInstance();
    const timestampList = [{start: 0, end: 0}];
    const matches = await getMatchDetailsFromAPI(timestampList, gamer, API, 5);
    await writeMatchesToDatabase(matches);
    await writeGamerMatchesToDatabase(matches, gamer);
    await refreshMatchAnalytics();
}