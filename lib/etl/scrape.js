import database from '../database';
import apiLib from 'call-of-duty-api';
import Bluebird from 'bluebird';
const API = apiLib({platform: "battle", ratelimit: { maxRequests: 2, perMilliseconds: 1000, maxRPS: 2 }});
let EMAIL = process.env.WARZONE_EMAIL;
let PASSWORD = process.env.WARZONE_PASSWORD;

function getGamer(username, platform = API.platforms.xbl) {
    return API.login(EMAIL, PASSWORD).then((response, api) => {
        return API.MWwzstats(username, platform).then((gamer) => {
            return database.then((db) => {
                let dataObject = {
                    username: gamer.username,
                    platform: gamer.platform
                }
                return db.gamers.insert(dataObject).then((success) => {
                    return gamer;
                }, (failure) => {
                    return gamer;
                    // throw new Error("Gamer " + username + " failed to be inserted into the database. Error: " + JSON.stringify(failure));
                })
            })
        });
    });
}


function getMinAndMaxTimestamps(output, key){
    let firstTimestamp = Number.MAX_SAFE_INTEGER;
    let lastTimestamp = 0;
    output.forEach((match) => {
        if (match[key] > lastTimestamp) {
            lastTimestamp = match[key];
        }
        if (match[key] < firstTimestamp) {
            firstTimestamp = match[key];
        }
    });

    return {
        min: firstTimestamp,
        max: lastTimestamp
    }
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


function generateTimestampList(object){
    let oneWeek = 604800000/7;
    let workingTimestamp = object.lastTimestamp;
    let timestampList = [];
    while(workingTimestamp > object.firstTimestamp){
        let endTimestamp = workingTimestamp;
        let startTimestamp = workingTimestamp - oneWeek;
        timestampList.push({
            start: startTimestamp,
            end:endTimestamp
        })
        workingTimestamp = workingTimestamp - oneWeek;
    }

    return timestampList;
}

function getMatchDetails(object) {
    let timestampList = generateTimestampList(object);
    return API.login(EMAIL, PASSWORD).then((response, api) => {
        let promises = timestampList.map((item)=>{
            return API.MWcombatwzdate(object.gamer.username, item.start, item.end, object.gamer.platform)
        })
       return Bluebird.all(promises).then((output) => {
           let matches = output.flatMap((line)=> line.matches)
        }, (failure)=>{
       }, {concurrency: 2}).catch((err) => {
            console.log(err);
        });
    });
}

function run() {
    getGamer('EcZachly', API.platforms.xbl)
        .then(getMatches)
        .then(getMatchDetails);
}

run();
