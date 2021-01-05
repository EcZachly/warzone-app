import Bluebird from 'bluebird';
import {getTimestampList} from './utils';
import {queryGamers, updateGamer} from '../model/gamers';
import {
    getMatchDetailsFromAPI,
    getMinMaxMatchTimestamps,
    writeGamerMatchesToDatabase,
    writeMatchesToDatabase
} from '../model/matches';
import ApiWrapper from '../api_wrapper';

//How many gamers we will process at one time
//Setting to 1 will only do one gamer concurrently
const THREAD_CONCURRENCY_LIMIT = 1;

/***
 Hits the Call of Duty API for the entire match history. Is limited to the most recent 1000 games.
 * @param gamer -- the gamer we are querying for
 * @param api -- the already authenticated API
 * @returns {Promise<{gamer, matchHistory, queriedTimestamps, isBackfill}>}
 */
async function getMatchHistory(gamer, api) {
    console.log('querying history for gamer:' + gamer.username + ' on platform:' + gamer.platform);
    if (gamer.needs_backfill) {
        console.log('BACKFILLING ENTIRE DATASET!!!');
    }
    try {
        const history = await api.MWfullcombatwz(gamer.username, gamer.platform);
        console.log('found history for gamer:' + gamer.username + ' on platform:' + gamer.platform);
        console.log('game history of size:' + history.length);
        return history;
    } catch (e) {
        console.log('err', e);
        return {errorMessage: e}
    }
}


/**
 * This function takes the response from getMatchHistory and transform it into time frames
 * that return at most 20 games at a time.
 * @param matchHistory
 * @param queriedTimestamps
 * @param gamer
 * @returns {[] -- an array of valid time frames}
 */
function getQueryTimeframes(matchHistory, queriedTimestamps, gamer) {
    const hasLatestTimestamp = queriedTimestamps.last_timestamp;
    let matchesCopied = matchHistory;
    if (hasLatestTimestamp && !gamer.needs_backfill) {
        matchesCopied = matchHistory.filter((match) => {
            return match.timestamp > parseFloat(queriedTimestamps.last_timestamp);
        });
    }

    let timestampList = [];
    if (matchesCopied.length > 0) {
        timestampList = getTimestampList(matchesCopied);
    }
    return timestampList;
}


async function getMatchDetails(queryTimeframes, gamer, API){
    const matches = await getMatchDetailsFromAPI(queryTimeframes, gamer, API);
    await writeMatchesToDatabase(matches);
    await writeGamerMatchesToDatabase(matches, gamer);
    if (gamer.needs_backfill) {
        await updateGamer({username: gamer.username, platform: gamer.platform}, {needs_backfill: false});
    }
    return matches;
}

/**
 *
 * Function that does the following:
 *
 * 1. Gets the match history for the gamer passed in
 * 2. Queries for the first and last timestamps already in the database
 * 3. Filters the match history to only matches after the last timestamp in the database
 * 3. Queries any necessary match details data and inserts the data
 * 4. Finishes and returns.
 * @param gamer
 * @param API
 * @returns {Promise<{gamer, matchHistory, queriedTimestamps, isBackfill}>}
 */
async function executePipeline(gamer) {
    const API = await ApiWrapper.getInstance();
    const history = await getMatchHistory(gamer, API);
    if(history.errorMessage){
        console.log(history)
    }
    else{
        const queriedTimestamps = await getMinMaxMatchTimestamps(gamer);
        const queryTimeframes = getQueryTimeframes(history, queriedTimestamps, gamer);

        if (queryTimeframes.length > 0) {
            const matches = await getMatchDetails(queryTimeframes, gamer, API);
            console.log('Found ' + matches.length + ' matches for player: ' + gamer.username + ' on platform: ' + gamer.platform);
        } else {
            console.log('No new games found for gamer: ' + gamer.username  + ' on platform: ' + gamer.platform + ', doing nothing');
        }

        if (gamer.needs_update) {
            await updateGamer({username: gamer.username, platform: gamer.platform}, {needs_update: false});
        }
        return gamer;
    }


}

/**
 * First queries the gamers table,
 * then executes the pipeline for each gamer
 * @param query
 * @returns {PromiseLike<void>}
 */
async function refreshData(query = {}) {
    const gamers = await queryGamers(query);
    await Bluebird.map(gamers, (gamer) => executePipeline(gamer), {concurrency: THREAD_CONCURRENCY_LIMIT});
    console.log('Finished entire refresh');
}

export async function runUpdates(){
    await refreshData({needs_update: true});
}

export async function runBackfills() {
    await refreshData({needs_backfill: true});
}

export async function runRefresh(){
    await refreshData({username: 'EcZachly'});
}

runRefresh()
