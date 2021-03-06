import tracer from 'tracer';
const logger = tracer.colorConsole();

import Bluebird from 'bluebird';

import {getTimestampList} from './etl_utils';
import {queryGamers, queryFollowedGamers, updateGamer} from '../model/gamers';
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
    console.log(`${generateGamerID(gamer)}: Querying match history`);

    if (gamer.needs_backfill) {
        console.log(`${generateGamerID(gamer)}: Backfilling all data`);
    }

    try {
        const history = await api.MWfullcombatwz(gamer.username, gamer.platform);
        return history;
    } catch (e) {
        console.log('err', e);

        return {errorMessage: e};
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


async function getMatchDetails(queryTimeframes, gamer, API) {
    const matches = await getMatchDetailsFromAPI(queryTimeframes, gamer, API);

    const gamerMatchWriteOptions = {
        onConflict: {
            target: ['uno_id', 'match_id'],
            action: 'ignore'
        }
    };
    const matchWriteOptions = {
        onConflict: {
            target: ['match_id'],
            action: 'ignore'
        }
    };
    await writeMatchesToDatabase(matches, matchWriteOptions);
    await writeGamerMatchesToDatabase(matches, gamer, gamerMatchWriteOptions);

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
    const gamerID = generateGamerID(gamer);

    console.log('\r\n' + gamerID + ': Starting update');

    if (gamer.no_permission === true) {
        logger.warn('gamer.no_permission flag is set to true, not expecting to update');
    }

    const API = await ApiWrapper.getInstance();
    const history = await getMatchHistory(gamer, API);

    if (history.errorMessage) {
        console.log(gamerID + ': ERROR: ' + JSON.stringify(history));

        const isPermissionError = history.errorMessage.toLowerCase().includes('not permitted');

        if (isPermissionError && gamer.no_permission !== true) {
            await updateGamer({username: gamer.username, platform: gamer.platform}, {no_permission: true});
        }

        return gamer;
    } else {
        console.log(`${generateGamerID(gamer)}: Found ${history.length} matches in history`);

        const queriedTimestamps = await getMinMaxMatchTimestamps(gamer);
        const queryTimeframes = getQueryTimeframes(history, queriedTimestamps, gamer);

        if (queryTimeframes.length > 0) {
            const matches = await getMatchDetails(queryTimeframes, gamer, API);
            console.log(`${generateGamerID(gamer)}: Found ${matches.length} new matches`);
        } else {
            console.log(`${generateGamerID(gamer)}: No new matches found for gamer`);
        }

        if (gamer.needs_update) {
            await updateGamer({username: gamer.username, platform: gamer.platform}, {needs_update: false});
        }

        console.log(gamerID + ': Update complete\r\n');

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
}

export async function refreshFollowedGamers() {
    // only update followed users who have already been backfilled
    const gamers = await queryFollowedGamers({needs_backfill: false});
    await Bluebird.map(gamers, (gamer) => executePipeline(gamer), {concurrency: THREAD_CONCURRENCY_LIMIT});
}

export async function runUpdates() {
    console.log('\r\n\r\nstarting cron job: runUpdates');
    await refreshData({needs_update: true});
    console.log('runUpdates complete\r\n\r\n');
}

export async function runBackfills() {
    console.log('\r\n\r\nstarting cron job: runBackfills');
    await refreshData({needs_backfill: true});
    console.log('runBackfills complete\r\n\r\n');
}


function generateGamerID(gamer) {
    return [gamer.platform, gamer.username].join('-');
}