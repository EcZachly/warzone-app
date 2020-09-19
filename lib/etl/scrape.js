import Bluebird from 'bluebird';
import {getTimestampList} from './utils';
import {queryGamers} from '../model/gamers';
import {
    getMatchDetailsFromAPI,
    getMinMaxMatchTimestamps,
    writeGamerMatchesToDatabase,
    writeMatchesToDatabase
} from '../model/matches';
import {login} from '../api_wrapper';

/***
 Hits the Call of Duty API for the entire match history. Is limited to the most recent 1000 games.
 * @param gamer -- the gamer we are querying for
 * @param api -- the already authenticated API
 * @param IS_BACKFILL -- whether we want to try to backfill all of history or just the most recent
 * @returns {Promise<{gamer, matchHistory, queriedTimestamps, isBackfill}>}
 */
async function getMatchHistory(gamer, api) {
    console.log('querying history for gamer:' + gamer.username + ' on platform:' + gamer.platform);
    try {
        let history = await api.MWfullcombatwz(gamer.username, gamer.platform);
        console.log('found history for gamer:' + gamer.username + ' on platform:' + gamer.platform);
        console.log('game history of size:' + history.length);
        return history;
    }
    catch(e){
        console.log(e);
    }
}


/**
 * This function takes the response from getMatchHistory and transform it into time frames
 * that return at most 20 games at a time.
 * @param matchHistory
 * @param queriedTimestamps
 * @param isBackfill
 * @returns {[] -- an array of valid time frames}
 */
function getQueryTimeframes(matchHistory, queriedTimestamps, isBackfill) {
    let hasLatestTimestamp = queriedTimestamps.last_timestamp;
    let matchesCopied = matchHistory
    if (hasLatestTimestamp && !isBackfill) {
        matchesCopied = matchHistory.filter((match)=>{
            return  match.timestamp > parseFloat(queriedTimestamps.last_timestamp) * 1000
        });
    }

    let timestampList = []
    if(matchesCopied.length > 0){
        timestampList = getTimestampList(matchesCopied, 'timestamp');
    }

    return timestampList
}

/**
 *
 * Function that does the following:
 *
 * 1. Gets the match history for the gamer passed in
 * 2. Queries for the first and last timestamps already in the database
 * 3. Filters the match history to only matches after the last timestamp in the database (or everything if IS_BACKFILL is true)
 * 3. Queries any necessary match details data and inserts the data
 * 4. Finishes and returns.
 * @param gamer
 * @param API
 * @param IS_BACKFILL
 * @returns {Promise<{gamer, matchHistory, queriedTimestamps, isBackfill}>}
 */
async function executePipeline(gamer, API, IS_BACKFILL = false) {
    let history = await getMatchHistory(gamer, API);
    let queriedTimestamps = await getMinMaxMatchTimestamps(gamer);
    let queryTimeframes = getQueryTimeframes(history, queriedTimestamps, IS_BACKFILL);
    let matches = await getMatchDetailsFromAPI(queryTimeframes, gamer, API);
    let createdMatches = await writeMatchesToDatabase(matches);
    let createdGamerMatches = await writeGamerMatchesToDatabase(matches, gamer);
    return  {createdGamerMatches, createdMatches};
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

refreshData({});