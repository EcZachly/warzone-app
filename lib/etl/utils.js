import database from "../database";
import {DATABASE_SCHEMA} from '../constants';

export function queryDatabase(table, query) {
    return database.then((db) => {
        return db[DATABASE_SCHEMA][table].find(query);
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
    //First we sort the array to make sure the matches are ordered by timestamp
    output.sort(function (first, second) {
        return first[key] < second[key]
    })
    let filtered = output.filter((match) => match[key] > 1000);
    //Our very first timestamp limit would be the timestamp of the very first game

    currentFirstTimestamp = filtered[0][key];
    filtered.forEach((match, index) => {
        //When we've reached a multiple of 20, we now can compute the window needed to extract 20 games
        //After we add our interval, we update the currentFirstTimestamp to 1 millisecond after the last
        if (index > 0 && index % 20 === 0) {
            currentLastTimestamp = match[key]
            timestampList.push({
                end: currentFirstTimestamp,
                start: currentLastTimestamp
            })
            currentFirstTimestamp = currentLastTimestamp
        }

        //If we're at the end of the array and we aren't at a multiple of 20
        //Then we need to add one more interval which is the remainder tail
        // (e.g. If a user has 34 games. This interval would return 14)
        if (index === filtered.length - 1 && index % 20 !== 0) {
            currentLastTimestamp = match[key]
            timestampList.push({
                end: currentFirstTimestamp,
                start: currentLastTimestamp
            })
        }
    });

    return timestampList
}

export function insertIntoDatabase(data, table) {
    return database.then((db) => {
        return db[DATABASE_SCHEMA][table].insert(data).then((success) => {
            return data;
        }, (failure) => {
            if (failure.code !== '23505') {
                console.log(failure);
            }
            return data;
        }).catch((failure) => {
            if (failure.code !== '23505') {
                console.log(failure);
            }
        })
    })
}

export function updateDatabaseRecords(query, data, table) {
    return database.then((db) => {
        return db[DATABASE_SCHEMA][table].update(query, data).then((success) => {
            return data;
        }, (failure) => {
            console.log(failure);
            return data;
        }).catch((failure) => {
            console.log(failure);
        })
    })
}