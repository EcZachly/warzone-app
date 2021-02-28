import {getFullMatchDetailsFromAPI, writeGamerMatchesToDatabase} from '../model/matches';
import Bluebird from 'bluebird';
import {queryView} from '../database_utils';
import {VIEWS} from '../constants';

/**
 * First queries the gamers table,
 * then executes the pipeline for each gamer
 * @param query
 * @returns {PromiseLike<void>}
 */
async function refreshData(query = {}) {
    const matches = await queryView(VIEWS.MATCHES_TO_AUGMENT, {}, {limit: 1000});
    console.log('found ' + matches.length + ' matches to augment!');
    await Bluebird.map(matches, (match) => {
        const match_id = match['match_id'];
        console.log('augmenting match ' + match_id);

        const writeOptions = {
            onConflict: {
                target: ['uno_id', 'match_id'],
                action: 'ignore'
            }
        };
        return getFullMatchDetailsFromAPI(match_id).then((data) => {
            return writeGamerMatchesToDatabase(data, {username: '-', platform: '-'}, writeOptions);
        });
    }, {concurrency: 1}).then((done) => {
        console.log('done!');
    });
}

refreshData();