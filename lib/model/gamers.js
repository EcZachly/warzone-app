import CallOfDutyApi from 'call-of-duty-api';

import {GAMER_TABLE} from '../constants';

import {insertIntoDatabase, queryDatabase, updateDatabaseRecords} from '../etl/utils';
import WarzoneMapper from '../etl/mapper';
import {login} from '../api_wrapper';

import UtilityService from './../services/UtilityService.js';

const API = CallOfDutyApi({platform: 'battle', ratelimit: {maxRequests: 2, perMilliseconds: 1000, maxRPS: 2}});

let EMAIL = process.env.WARZONE_EMAIL;
let PASSWORD = process.env.WARZONE_PASSWORD;

//===---==--=-=--==---===----===---==--=-=--==---===----//



export function getGamerFromAPI(username, platform) {
	return API.login(EMAIL, PASSWORD).then(() => {
		return API.MWwz(username, platform);
	});
}



export async function initializeGamer(queryGamer) {
	let API = await login();
	let gamer = await API.MWwz(queryGamer.username, queryGamer.platform);
	gamer.needs_backfill = true;
	return insertIntoDatabase(WarzoneMapper.mapGamer(gamer), GAMER_TABLE);
}



export function updateGamer(query, gamer) {
	return updateDatabaseRecords(query, gamer, GAMER_TABLE);
}



export function queryGamers(query) {
	query = UtilityService.validateItem(query, 'object', {});
	return queryDatabase(GAMER_TABLE, query);
}