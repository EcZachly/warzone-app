import {queryMatches, getFullMatchDetailsFromAPI, writeGamerMatchesToDatabase} from "../model/matches";
import Bluebird from 'bluebird';
import ApiWrapper from "../api_wrapper";

/**
 * First queries the gamers table,
 * then executes the pipeline for each gamer
 * @param query
 * @returns {PromiseLike<void>}
 */
async function refreshData(query = {}) {
    const matches = await queryMatches(query);
    await Bluebird.mapSeries(matches, (match) => {
        return getFullMatchDetailsFromAPI(match['match_id']).then((data)=>{
            return writeGamerMatchesToDatabase(data, {});
        })
    }).then((done)=>{
        console.log('done!');
    })
}
