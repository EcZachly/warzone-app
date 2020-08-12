import database from "../database";

export function generateTimestampList(object) {
    let WARZONE_MAX_GAMEREQUESTS = 20;
    let CLUSTERING_FUDGE_FACTOR = 3;
    let totalRequests = Math.ceil(object.gameCount.toFixed(2) / WARZONE_MAX_GAMEREQUESTS);
    let timeFrame = object.lastTimestamp - object.firstTimestamp;
    let subNum = Math.ceil(Math.ceil(timeFrame / totalRequests) / CLUSTERING_FUDGE_FACTOR);

    let workingTimestamp = object.lastTimestamp;
    let timestampList = [];
    while (workingTimestamp > object.firstTimestamp) {
        let endTimestamp = workingTimestamp;
        let startTimestamp = workingTimestamp - subNum;
        timestampList.push({
            start: startTimestamp,
            end: endTimestamp
        })
        workingTimestamp = workingTimestamp - subNum;
    }

    return timestampList;
}

export function getMinAndMaxTimestamps(output, key) {
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

export function insertIntoDatabase(data, table){
    return database.then((db) => {
        return db[table].save(data).then((success) => {
            return data;
        }, (failure) => {
            // console.log(failure);
            return data;
            // throw new Error("Gamer " + username + " failed to be inserted into the database. Error: " + JSON.stringify(failure));
        }).catch((failure)=>{
            // console.log(failure);
        })
    })
}