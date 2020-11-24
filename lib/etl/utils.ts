import database from '../database';
import {DATABASE_SCHEMA} from '../constants';



//===---==--=-=--==---===----===---==--=-=--==---===----//

export function getTimestampList(output) {
	let currentFirstTimestamp = 0;
	let currentLastTimestamp = 0;
	const timestampList = [];

	//First we sort the array to make sure the matches are ordered by timestamp
	output.sort(function(first, second) {
		return first.timestamp < second.timestamp;
	});

	const filtered = output.filter((match) => match.timestamp > 0);

	//Our very first timestamp limit would be the timestamp of the very first game
	currentFirstTimestamp = new Date().getTime();

	filtered.forEach((match, index) => {
		//When we've reached a multiple of 20, we now can compute the window needed to extract 20 games
		//After we add our interval, we update the currentFirstTimestamp to 1 millisecond after the last
		if (index > 0 && index % 20 === 0) {
			currentLastTimestamp = match.timestamp;
			timestampList.push({
				end: currentFirstTimestamp,
				start: currentLastTimestamp
			});
			currentFirstTimestamp = currentLastTimestamp;
		}

		//If we're at the end of the array
		//Then we need to add one more interval which is the remainder tail
		// (e.g. If a user has 34 games. This interval would return 14)
		if (index === filtered.length - 1) {
			currentLastTimestamp = match.timestamp;
			timestampList.push({
				end: currentFirstTimestamp,
				start: currentLastTimestamp
			});
		}
	});

	return timestampList;
}



export async function queryDatabase(table, query, options = {}) {
	const db = await database;
	return db[DATABASE_SCHEMA][table].find(query, options);
}



export async function insertIntoDatabase(data, table) {
	const db = await database;
	try {
		return await db[DATABASE_SCHEMA][table].insert(data);
	} catch (failure) {
		const isDuplicateRecordError = failure.code === '23505';
		if (!isDuplicateRecordError) {
			console.log(failure);
		}
	}
}



export async function updateDatabaseRecords(query, data, table) {
	const db = await database;

	try {
		return await db[DATABASE_SCHEMA][table].update(query, data);
	} catch (failure) {
		console.log(failure);
	}
}