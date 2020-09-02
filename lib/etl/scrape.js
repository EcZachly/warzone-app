import {GAMER_MATCH_TABLE, GAMER_TABLE, MATCH_TABLE} from "../constants";
import WarzoneMapper from './mapper';

import Bluebird from 'bluebird';
import {generateTimestampList, getMinAndMaxTimestamps, insertIntoDatabase} from './utils';

import apiLib from 'call-of-duty-api';

const API = apiLib({platform: "battle", ratelimit: {maxRequests: 2, perMilliseconds: 1000, maxRPS: 2}});

let EMAIL = process.env.WARZONE_EMAIL;
let PASSWORD = process.env.WARZONE_PASSWORD;

function getGamer(username, platform = API.platforms.xbl) {
    return API.login(EMAIL, PASSWORD).then(() => {
        return API.MWwz(username, platform).then((gamer) => {
            console.log(gamer);
            return insertIntoDatabase(WarzoneMapper.mapGamer(gamer), GAMER_TABLE);
        });
    });
}

function getMatches(gamer) {
    return API.login(EMAIL, PASSWORD).then((response, api) => {
        return API.MWfullcombatwz(gamer.username, gamer.platform).then((output) => {
            console.log(output);
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
    return API.login(EMAIL, PASSWORD).then((response, api) => {
        let promises = timestampList.map((item) => {
            return API.MWcombatwzdate(object.gamer.username, item.start, item.end, object.gamer.platform)
        })
        return Bluebird.all(promises).then(
            (output) => {
                let matches = output.flatMap((line) => line.matches).filter((match) => !!match);
                console.log(matches);
                let mappedMatches = matches.map(WarzoneMapper.mapMatch);
                let matchPromises = mappedMatches.map((m) => {
                    return insertIntoDatabase(m, MATCH_TABLE)
                });
                return Bluebird.all(matchPromises).then((success) => {
                    let gamerMatches = matches.map(WarzoneMapper.mapGamerMatch).filter((match) => match.match_id && match.username)
                    console.log(gamerMatches);

                    let gamer = {
                        username: gamerMatches[0].username,
                        platform: null
                    }
                    let gamerMatchPromises = gamerMatches.map((m) => {
                        return insertIntoDatabase(m, GAMER_MATCH_TABLE)
                    });
                    return insertIntoDatabase(gamer, GAMER_TABLE).then(
                        (success)=>{
                            return Bluebird.all(gamerMatchPromises)
                        }
                    );
                })
            }, (failure) => {
            }, {concurrency: 2}).catch((err) => {
            console.log(err);
        });
    });
}

function getGamerFriends(gamer) {
    return API.login(EMAIL, PASSWORD).then((response, api) => {
        return API.MWfriends(gamer.username, gamer.platform).then((friends) => {
            console.log(friends);
            return Bluebird.all(
                friends.map(WarzoneMapper.mapGamer)
                    .map((friend) => insertIntoDatabase(friend, GAMER_TABLE)
                    )
            )
        })
    });
}

function run() {
    getGamer('Chimpzilla#1735', API.platforms.battle)
        // .then(getGamerFriends)
        .then(getMatches)
        .then(getMatchDetails);
}


run();
