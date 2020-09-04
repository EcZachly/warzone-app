import {GAMER_MATCH_TABLE, GAMER_TABLE, MATCH_TABLE, MIN_MAX_TIMESTAMPS_VIEW} from "../constants";
import WarzoneMapper from './mapper';

import Bluebird from 'bluebird';
import {generateTimestampList, getMinAndMaxTimestamps, insertIntoDatabase, queryDatabase} from './utils';

import apiLib from 'call-of-duty-api';

const API = apiLib({platform: "xbl", ratelimit: {maxRequests: 1, perMilliseconds: 10000, maxRPS: 1}});

let EMAIL = process.env.WARZONE_EMAIL;
let PASSWORD = process.env.WARZONE_PASSWORD;

let BACKFILL_ALL_DATA = true;

function getGamer(queryGamer) {
    return API.login(EMAIL, PASSWORD).then(() => {
        return API.MWwz(queryGamer.username, queryGamer.platform).then((gamer) => {
            return insertIntoDatabase(WarzoneMapper.mapGamer(gamer), GAMER_TABLE);
        });
    });
}

function getMatches(gamer) {
    return API.login(EMAIL, PASSWORD).then((response, api) => {
        return API.MWfullcombatwz(gamer.username, gamer.platform).then((output) => {
            return queryDatabase(MIN_MAX_TIMESTAMPS_VIEW, {query_username: gamer.username}).then((data)=>{
                let queriedTimestamps = data[0];
                let timestamps = getMinAndMaxTimestamps(output, 'timestamp');

                let returnObject = {
                    gamer: gamer,
                    gameCount: output.length,
                    lastTimestamp: timestamps.max,
                    firstTimestamp: timestamps.min
                };

                if(queriedTimestamps && !BACKFILL_ALL_DATA){
                    returnObject.gameCount = returnObject.gameCount - queriedTimestamps.game_count;
                    returnObject.firstTimestamp = parseInt(queriedTimestamps.last_timestamp)*1000;
                }

                return returnObject;
            })
        }).catch((err) => {
            console.log(err);
        });
    });
}

function getMatchDetails(object) {
    let timestampList = generateTimestampList(object);
    let queryGamer = object.gamer;
    console.log("getting match details for: " + JSON.stringify(queryGamer))
    return API.login(EMAIL, PASSWORD).then((response, api) => {
        return Bluebird.mapSeries(timestampList, (item)=>{
            return API.MWcombatwzdate(object.gamer.username, item.start, item.end, object.gamer.platform).then((output)=>{
                let matches = output.matches || [];
                let mappedMatches = matches.map(WarzoneMapper.mapMatch);
                let matchPromises = mappedMatches.map((m) => {
                    return insertIntoDatabase(m, MATCH_TABLE)
                });
                return Bluebird.all(matchPromises).then((success) => {
                    let gamerMatches = matches.map((match) => WarzoneMapper.mapGamerMatch(match, queryGamer)).filter((match) => match.match_id && match.username)
                    let gamerMatchPromises = gamerMatches.map((m) => insertIntoDatabase(m, GAMER_MATCH_TABLE));
                    return Bluebird.all(gamerMatchPromises);
                });
            });
        })
    });
}

function getGamerFriends(gamer) {
    return API.login(EMAIL, PASSWORD).then((response, api) => {
        return API.MWfriends(gamer.username, gamer.platform).then((friends) => {
            return Bluebird.all(
                friends.map(WarzoneMapper.mapGamer)
                    .map((friend) => insertIntoDatabase(friend, GAMER_TABLE)
                    )
            )
        })
    });
}

function executePipeline(gamer){
    return  getGamer(gamer)
        // .then(getGamerFriends)
        .then(getMatches)
        .then(getMatchDetails);
}

function run() {
    queryDatabase(GAMER_TABLE, {platform: 'xbl'}).then((gamers)=> {
        return Bluebird.mapSeries(gamers, (gamer)=>{
            return executePipeline(gamer).then(success=>{
                console.log("finished stats for gamer" + JSON.stringify(gamer));
                return success;
            });
        });
    }).then((finished)=>{
        console.log("DONE!");
    });
}


run();
