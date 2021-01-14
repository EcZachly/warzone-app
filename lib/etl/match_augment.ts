import {getFullMatchDetailsFromAPI, writeGamerMatchesToDatabase} from "../model/matches";
import Bluebird from 'bluebird';
import {queryView} from "../database_utils";
import {VIEWS} from "../constants";

/**
 * First queries the gamers table,
 * then executes the pipeline for each gamer
 * @param query
 * @returns {PromiseLike<void>}
 */
async function refreshData(query = {}) {
    const matches = await queryView(VIEWS.MATCHES_TO_AUGMENT, {});
    await Bluebird.mapSeries(matches, (match) => {
        let {match_id} = match;
        console.log('augmenting match ' + match_id);
        return getFullMatchDetailsFromAPI(match_id).then((data)=>{
            return Bluebird.mapSeries(data.map((match, index)=>{
                console.log(`writin ${index}th role`);
                return writeGamerMatchesToDatabase([match], { username: '-', platform: '-'});
            }));
        });
    }).then((done)=>{
        console.log('done!');
    })
}


refreshData();
