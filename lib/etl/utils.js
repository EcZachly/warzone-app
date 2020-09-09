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

export function getTimestampList(output, key) {
    let currentFirstTimestamp = 0;
    let currentLastTimestamp = 0;
    let timestampList = [];
    output.sort(function(first, second){
        return first[key] > second[key]
    })
    let filtered = output.filter((match)=> match[key] > 0);
    filtered.forEach((match, index) => {
        if(index === 0){
            currentFirstTimestamp = match[key]
        }

        if(index > 0 && index % 20 === 0){
            currentLastTimestamp = match[key]
            timestampList.push({
                end: currentFirstTimestamp,
                start: currentLastTimestamp
            })
            currentFirstTimestamp = currentLastTimestamp + 1
        }

        if(index === filtered.length - 1 && index % 20 !== 0){
            currentLastTimestamp = match[key]
            timestampList.push({
                end: currentFirstTimestamp,
                start: currentLastTimestamp
            })
        }
    });

    return timestampList
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