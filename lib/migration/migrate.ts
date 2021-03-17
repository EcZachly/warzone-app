import database from '../database';
import _ from 'lodash';
import database_new from './database_new';
import Bluebird from 'bluebird';
const schema = 'warzone';


async function getUsers(){
    const db = await database;
    const users = await db[schema]['users'].find();
    const newDb = await database_new;

    const groups = _.chunk(users, 500);
    return Promise.all(groups.map(async (group)=>{
       return await newDb[schema]['users'].insert(group);
    }));
}

async function getGamers(){
    const db = await database;
    const gamers = await db['warzone']['gamers'].find();
    const newDb = await database_new;

    const groups = _.chunk(gamers, 500);
    return Promise.all(groups.map(async (group)=>{
        return await newDb[schema]['gamers'].insert(group);
    }));
}

async function getGamerRelationships(){
    const db = await database;
    const gamers = await db['warzone']['gamer_relationships'].find();
    const newDb = await database_new;

    const groups = _.chunk(gamers, 500);
    return Promise.all(groups.map(async (group)=>{
        return await newDb[schema]['gamer_relationships'].insert(group);
    }));
}

async function getMatches(){
    const db = await database;
    const matches = await db['warzone']['matches'].find();
    const newDb = await database_new;
    const writeOptions = {
        onConflict: {
            target: [ 'match_id'],
            action: 'ignore'
        }
    };
    const groups = _.chunk(matches, 500);
    return Promise.all(groups.map(async (group)=>{
       return await newDb[schema]['matches'].insert(group, writeOptions);
    }));
}

async function mapGamerMatches(){

    const db = await database;
    const matches = await db['warzone']['matches'].find();
    const matchesDict = {};

    matches.forEach((match)=>{
        matchesDict[match.match_id] = match;
    });

    const newDb = await database_new;

    const totalCnt = 82000;
    const step = 20000;
    let start = 0;
    const writeOptions = {
        onConflict: {
            target: ['uno_id', 'match_id'],
            action: 'ignore'
        }
    };
    let startArr = [];
    while(start < totalCnt){
        startArr.push(start);
        start += step;
    }

    await Bluebird.map(startArr, async (startVal)=>{
        const gamerMatches = await db['warzone']['gamer_matches'].find({'query_platform <>': 'uno'}, {offset: startVal, limit: step});
        const mappedMatches = gamerMatches.map((match)=>{
            const matchData = matchesDict[match.match_id];
            match.game_category = matchData.game_category;
            match.game_mode = matchData.mode;
            match.start_timestamp = matchData.start_timestamp;
            match.end_timestamp = matchData.end_timestamp;
            match.team_type = matchData.team_type;
            match.loadout = '[]';
            // match.loadout = JSON.stringify(match.loadout);
            return match;
        }).filter((match)=> !!match.uno_id);
        const groups = _.chunk(mappedMatches, 1000);
        await Bluebird.map(groups, async function(group){
            console.log('inserting ' + 1000 + ' rows');
            return await newDb[schema]['gamer_matches'].insert(group, writeOptions);
        }, {concurrency: 5}).then((done)=>{
            console.log('done');
        });

    }, {concurrency: 2});
}

async function runMigration(){
    // await getUsers();
    // await getGamers();
    // await getGamerRelationships();
    // await getMatches()
    await mapGamerMatches();
}


runMigration();