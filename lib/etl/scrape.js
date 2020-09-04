import {GAMER_MATCH_TABLE, GAMER_TABLE, MATCH_TABLE} from "../constants";
import WarzoneMapper from './mapper';

import Bluebird from 'bluebird';
import {generateTimestampList, getMinAndMaxTimestamps, insertIntoDatabase, queryDatabase} from './utils';

import apiLib from 'call-of-duty-api';

const API = apiLib({platform: "battle", ratelimit: {maxRequests: 2, perMilliseconds: 1000, maxRPS: 2}});

let EMAIL = process.env.WARZONE_EMAIL;
let PASSWORD = process.env.WARZONE_PASSWORD;

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
            let timestamps = getMinAndMaxTimestamps(output, 'timestamp');
            let returnObject = {
                gamer: gamer,
                gameCount: output.length,
                lastTimestamp: timestamps.max,
                firstTimestamp: timestamps.min
            };
            return returnObject;
        }).catch((err) => {
            console.log(err);
        });
    });
}

function getMatchDetails(object) {
    let timestampList = generateTimestampList(object);
    let queryGamer = object.gamer;
    return API.login(EMAIL, PASSWORD).then((response, api) => {
        let promises = timestampList.map((item) => {
            return API.MWcombatwzdate(object.gamer.username, item.start, item.end, object.gamer.platform).then((output)=>{
                let matches = output.matches;
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
        });
        return Bluebird.mapSeries(promises);
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
                console.log("finished stats for gamer" + gamer);
                return success;
            });
        });
    }).then((finished)=>{
        console.log("DONE!");
    });
}


run();
