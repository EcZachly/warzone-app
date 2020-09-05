import database from "../database";
export function queryDatabase(table, query){
    return database.then((db) => {
        return db[table].find(query);
    });
}



export function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

export function generateTimestampList(object) {
    let subNum = 12*60*60*1000
    let workingTimestamp = object.lastTimestamp;
    let timestampList = [];
    if(object.gameCount === 1){
        timestampList.push({
            start: 0,
            end: 0
        })
    }
    else{
        while (workingTimestamp > object.firstTimestamp) {
            let endTimestamp = workingTimestamp;
            let startTimestamp = workingTimestamp - subNum;
            timestampList.push({
                start: startTimestamp,
                end: endTimestamp
            })
            workingTimestamp = workingTimestamp - subNum;
        }
    }
    timestampList = timestampList.reverse();
    return timestampList;
}

export function getMinAndMaxTimestamps(output, key) {
    let firstTimestamp = Number.MAX_SAFE_INTEGER;
    let lastTimestamp = 0;
    output.filter((match)=> match[key] > 0).forEach((match) => {
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
        return db[table].insert(data).then((success) => {
            return data;
        }, (failure) => {
            return data;
        }).catch((failure)=>{
        })
    })
}