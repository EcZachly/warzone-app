import Bluebird from 'bluebird';

import WarzoneMapper from '../etl/mapper';
import {insertIntoDatabase, queryDatabase} from '../etl/utils';
import {GAMER_MATCH_TABLE, MATCH_TABLE, MIN_MAX_TIMESTAMPS_VIEW, MATCH_DETAILS_SLEEP_TIME} from '../constants';
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
    const gamerMatchPromises = gamerMatches.map((m) => insertIntoDatabase(m, GAMER_MATCH_TABLE));
    return Bluebird.all(gamerMatchPromises);
}


/**
 * Takes a list of matches from the getMatchDetails API calls and writes it into warzone.matches table
 * @param matches
 * @returns {PromiseLike<any> | Promise<any>}
 */
export function writeMatchesToDatabase(matches) {
    const mappedMatches = matches.map(WarzoneMapper.mapMatch);
    const matchPromises = mappedMatches.map((m) => insertIntoDatabase(m, MATCH_TABLE));
    return Bluebird.all(matchPromises);
}


/**
 * Takes in a gamer and returns the first and last timestamps of matches they've played currently existing in the
 * database
 * @param gamer
 * @returns {*}
 */
export async function getMinMaxMatchTimestamps(gamer) {
    const gamers = await queryDatabase(MIN_MAX_TIMESTAMPS_VIEW, {
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
    console.log('# of Details API calls needed for gamer:' + gamer.username + ' on platform:' + gamer.platform + ': ' + queryTimeframes.length);
    console.log('getting match details for: ' + gamer.username + ' on platform:' + gamer.platform);

    const matches = await Bluebird.mapSeries(queryTimeframes, async (item) => {
        const output = await api.MWcombatwzdate(gamer.username, item.start, item.end, gamer.platform);
        const matches = UtilityService.validateItem(output.matches, 'array', []);

        console.log('Num matches for interval for gamer:' + gamer.username + ' on platform:' + gamer.platform + ':' + matches.length);

        UtilityService.sleep(sleepTime);

        return matches;
    });

    return UtilityService.validateItem(matches, 'array', []).flatMap((matchArr) => matchArr);
}



export async function initializeMatches(gamer) {
    const API = await ApiWrapper.getInstance();
    const timestampList = [{start: 0, end: 0}];
    const matches = await getMatchDetailsFromAPI(timestampList, gamer, API, 5);
    await writeMatchesToDatabase(matches);
    await writeGamerMatchesToDatabase(matches, gamer);
}
