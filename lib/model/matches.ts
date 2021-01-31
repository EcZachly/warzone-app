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
export function writeGamerMatchesToDatabase(matches, gamer, writeOptions = {}) {
    const gamerMatches = matches.map((match) => WarzoneMapper.mapGamerMatch(match, gamer)).filter((match) => match.match_id && match.username);

    return insertDatabaseValues(gamerMatches, TABLES.GAMER_MATCHES, writeOptions);
}



/**
 * Takes a list of matches from the getMatchDetails API calls and writes it into warzone.matches table
 * @param matches
 * @returns {PromiseLike<any> | Promise<any>}
 */
export function writeMatchesToDatabase(matches, writeOptions = {}) {
    const mappedMatches = matches.map(WarzoneMapper.mapMatch);
    return insertDatabaseValues(mappedMatches, TABLES.MATCHES, writeOptions);
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

    const matches = await Bluebird.mapSeries(queryTimeframes, async (item: { start: any, end: any }, index) => {
        const output = await api.MWcombatwzdate(gamer.username, item.start, item.end, gamer.platform);
        const matches = UtilityService.validateItem(output.matches, 'array', []);

        console.log(`${gamer.platform}-${gamer.username}: ${index + 1} of ${queryTimeframes.length}, getting ${matches.length} match details from API`);

        UtilityService.sleep(sleepTime);

        return matches;
    });

    console.log(gamerID + ': completed getting match details');

    return UtilityService.validateItem(matches, 'array', []).flatMap((matchArr) => matchArr);
}



export async function getFullMatchDetailsFromAPI(match_id) {
    const callApi = await ApiWrapper.getInstance();
    const data = await callApi.MWFullMatchInfowz(match_id);
    return data.allPlayers;
}



export async function queryMatches(query, options = {}) {
    query = UtilityService.validateItem(query, 'object', {});
    return queryDatabase(TABLES.MATCHES, query, options);
}



export async function refreshMatchAnalytics() {
    const viewsToRefresh = [
        VIEWS.GAMER_STAT_SUMMARY
    ].map((view) => view + '_materialized');
    return Bluebird.all(viewsToRefresh.map((view) => refreshMaterializedView(view)));
}



export async function initializeMatches(gamer) {
    const API = await ApiWrapper.getInstance();
    const timestampList = [{start: 0, end: 0}];
    const matches = await getMatchDetailsFromAPI(timestampList, gamer, API, 5);
    await writeMatchesToDatabase(matches);
    await writeGamerMatchesToDatabase(matches, gamer);
    await refreshMatchAnalytics();
}



export default {
    writeGamerMatchesToDatabase,
    writeMatchesToDatabase,
    getMinMaxMatchTimestamps,
    getMatchDetailsFromAPI,
    getFullMatchDetailsFromAPI,
    queryMatches,
    refreshMatchAnalytics,
    initializeMatches
};