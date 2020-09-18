import WarzoneMapper from "../etl/mapper";
import {insertIntoDatabase, queryDatabase, sleep} from "../etl/utils";
import {GAMER_MATCH_TABLE, MATCH_TABLE, MIN_MAX_TIMESTAMPS_VIEW} from "../constants";
import Bluebird from "bluebird";
import {login} from '../api_wrapper';

/**
 * Takes a list of gamer matches from the getMatchDetails API calls and writes it into the warzone.gamer_matches
 * @param matches
 * @param gamer
 * @returns {PromiseLike<any> | Promise<any>}
 */
export function writeGamerMatchesToDatabase(matches, gamer) {
    let gamerMatches = matches.map((match) => WarzoneMapper.mapGamerMatch(match, gamer)).filter((match) => match.match_id && match.username);
    let gamerMatchPromises = gamerMatches.map((m) => insertIntoDatabase(m, GAMER_MATCH_TABLE));
    return Bluebird.all(gamerMatchPromises);
}


/**
 * Takes a list of matches from the getMatchDetails API calls and writes it into warzone.matches table
 * @param matches
 * @returns {PromiseLike<any> | Promise<any>}
 */
export function writeMatchesToDatabase(matches) {
    let mappedMatches = matches.map(WarzoneMapper.mapMatch);
    let matchPromises = mappedMatches.map((m) => insertIntoDatabase(m, MATCH_TABLE));
    return Bluebird.all(matchPromises);
}


/**
 * Takes in a gamer and returns the first and last timestamps of matches they've played currently existing in the
 * database
 * @param gamer
 * @returns {*}
 */
export async function getMinMaxMatchTimestamps(gamer){
    let gamers = await queryDatabase(MIN_MAX_TIMESTAMPS_VIEW, {
        query_username: gamer.username,
        query_platform: gamer.platform
    });

    return gamers[0] || {};
}

/**
 * This takes in an object with 2 keys, gamer and timestampList
 * It then queries the Call Of Duty Api for each time frame in the timestampList
 * It then inserts all those matches into the database,
 * both into the warzone.gamer_matches and warzone.matches tables
 * @param object
 * @param api
 * @returns {*}
 */
export async function getMatchDetailsFromAPI(object, api, sleepTime = 7*1000) {
    let {timestampList, gamer} = object;
    console.log('# of Details API calls needed for gamer:' + gamer.username + ' on platform:' + gamer.platform + ': ' + timestampList.length);
    console.log("getting match details for: " + gamer.username + ' on platform:' + gamer.platform)
    return Bluebird.mapSeries(timestampList, async (item) => {
        let output = await api.MWcombatwzdate(object.gamer.username, item.start, item.end, object.gamer.platform);
        let matches =  output.matches || [];
        console.log('Num matches for interval:' + matches.length);
        sleep(sleepTime)
        let createdMatches = await writeMatchesToDatabase(matches);
        let createdGamerMatches = await writeGamerMatchesToDatabase(matches, gamer);
        return {createdGamerMatches, createdMatches};
    });
}

export async function initializeMatches(gamer){
    let API = await login();
    let timestampList = [{start: 0, end:0}];
    return await getMatchDetailsFromAPI({timestampList: timestampList, gamer: gamer}, API, 5);
}
