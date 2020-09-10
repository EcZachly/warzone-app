import {GAMER_MATCH_TABLE, GAMER_TABLE, MATCH_TABLE, MIN_MAX_TIMESTAMPS_VIEW} from "../constants";
import WarzoneMapper from './mapper';

import Bluebird from 'bluebird';
import {insertIntoDatabase, getTimestampList, queryDatabase, sleep} from './utils';

import apiLib from 'call-of-duty-api';

const API = apiLib({platform: "xbl", ratelimit: {maxRequests: 1, perMilliseconds: 10000, maxRPS: 1}});

let EMAIL = process.env.WARZONE_EMAIL;
let PASSWORD = process.env.WARZONE_PASSWORD;

let BACKFILL_ALL_DATA = true;

function getGamer(queryGamer, api) {
    return api.MWwz(queryGamer.username, queryGamer.platform).then((gamer) => {
        return insertIntoDatabase(WarzoneMapper.mapGamer(gamer), GAMER_TABLE);
    });
}

function getMatches(gamer, api) {
    return api.MWfullcombatwz(gamer.username, gamer.platform).then((output) => {
        return queryDatabase(MIN_MAX_TIMESTAMPS_VIEW, {query_username: gamer.username}).then((data) => {
            let queriedTimestamps = data[0] || [];
            let timestampList = getTimestampList(output, 'timestamp');
            let returnObject = {
                gamer: gamer,
                gameCount: output.length,
                timestampList: timestampList
            };
            console.log(output);
            if (queriedTimestamps && !BACKFILL_ALL_DATA) {
                returnObject.timestampList = returnObject.timestampList.filter(function (item) {
                    return item.end > parseInt(queriedTimestamps.last_timestamp) * 1000;
                })
            }
            return returnObject;
        })
    }).catch((err) => {
        console.log(err);
    });
}

function getMatchDetails(object, api) {
    let timestampList = object.timestampList
    let queryGamer = object.gamer;
    console.log("getting match details for: " + JSON.stringify(queryGamer))
    console.log(timestampList);
    return Bluebird.mapSeries(timestampList, (item) => {
        return api.MWcombatwzdate(object.gamer.username, item.start, item.end, object.gamer.platform).then((output) => {
            let matches = output.matches || [];
            sleep(7 * 1000)
            console.log('Num matches for interval:' + matches.length);
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
}

function executePipeline(gamer) {
    return API.login(EMAIL, PASSWORD).then((response, api) => {
        return getGamer(gamer, API)
            // .then(getGamerFriends)
            .then((data) => getMatches(data, API))
            .then((matches) => getMatchDetails(matches, API));
    });
}

function refreshPlatform(platform) {
    queryDatabase(GAMER_TABLE, {platform: platform}).then((gamers) => {
        return Bluebird.mapSeries(gamers, (gamer) => {
            return executePipeline(gamer).then(success => {
                console.log("finished stats for gamer" + JSON.stringify(gamer));
                return success;
            });
        });
    }).then((finished) => {
        console.log("DONE!");
    });
}


// refreshPlatform('battle')
executePipeline({username: 'EcZachly', platform: 'xbl'})