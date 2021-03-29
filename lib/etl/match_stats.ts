import {queryView, updateDatabaseValues} from '../database_utils';
import {TABLES, VIEWS} from '../constants';
import moment from 'moment';
import Bluebird from 'bluebird';
/**
 * First queries the gamers table,
 * then executes the pipeline for each gamer
 * @param query
 * @returns {PromiseLike<void>}
 */

const HISTORY_WINDOW = '3 months';
const GAME_CATEGORY = 'Warzone';

async function aggregateDailyMatches(matches, date){
    console.log('starting agg for date', date);
    let filteredMatchIds = matches.filter((match)=> match.start_timestamp > new Date(date) && match.start_timestamp < moment(date).add(1, 'day'))
                                    .map((match)=> match['match_id']);

    console.log('this many matches are relevant', filteredMatchIds.length);
    let gamerMatches =  await queryView(TABLES.GAMER_MATCHES, {match_id: filteredMatchIds, 'start_timestamp >': moment(date).add(-1, 'day'), 'start_timestamp <': moment(date).add(1, 'day') });

    console.log(`query ${HISTORY_WINDOW} history`);
    let avgPlayerData = await queryView(VIEWS.GAMER_STAT_SUMMARY_PREVIOUS, [date, HISTORY_WINDOW], {limit:2000});
    let matchObj = {};
    gamerMatches.forEach((gamerMatch)=>{
        if(!matchObj[gamerMatch['match_id']]){
            matchObj[gamerMatch['match_id']] = [gamerMatch];
        }
        else{
            matchObj[gamerMatch['match_id']].push(gamerMatch);
        }
    });
    await Promise.all(Object.keys(matchObj).map(async (match_id)=>{
        let gamerUnoIds = matchObj[match_id].map((data)=> data.uno_id);
        if(gamerUnoIds.length < 100){
            //Augment
            return Promise.resolve();
        }
        else{
            console.log('found this many uno ids', gamerUnoIds.length);
            let averagePlayerMatchData = avgPlayerData.filter((row)=> row['team_type'] === matchObj[match_id][0]['team_type'] && gamerUnoIds.includes(row['uno_id']));

            console.log('found this many average player skills', averagePlayerMatchData.length);
            let summaryStats = {
                average_player_kdr: 0,
                average_player_score: 0,
                average_player_skill_score: 0
            };
            averagePlayerMatchData.forEach((row)=>{
                summaryStats.average_player_kdr += (parseFloat(row['average_player_kdr']) || 0);
                summaryStats.average_player_score += (parseFloat(row['average_player_score']) || 0);
                summaryStats.average_player_skill_score += (parseFloat(row['average_player_skill_score'])|| 0);
            });
            summaryStats.average_player_kdr = summaryStats.average_player_kdr/averagePlayerMatchData.length;
            summaryStats.average_player_score = summaryStats.average_player_score/averagePlayerMatchData.length;
            summaryStats.average_player_skill_score = summaryStats.average_player_skill_score/averagePlayerMatchData.length;

            let updateObject = { is_augmented: true, ...summaryStats};
            return await updateDatabaseValues({match_id}, updateObject, TABLES.MATCHES);
        }
    }));
}

async function augmentAllMatches(date){
    const matches = await queryView(TABLES.MATCHES, {is_augmented: false, game_category: GAME_CATEGORY, 'start_timestamp >': moment(date).add(-1, 'day')});
    await aggregateDailyMatches(matches, date);
}


async function fireBatchEtl(){
    let startDate = moment('2020-05-07');
    let endDate = moment('2021-03-25');
    let dateArr = [];


    while(startDate < endDate){
        dateArr.push(startDate);
        startDate = moment(startDate).add(1, 'day');
    }
    await Bluebird.map(dateArr.reverse(), async (date)=>{
        return await augmentAllMatches(date.format('YYYY-MM-DD'));
    }, {concurrency: 3});
}

fireBatchEtl();