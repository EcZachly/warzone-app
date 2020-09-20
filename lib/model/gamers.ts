import {insertIntoDatabase, queryDatabase, updateDatabaseRecords} from "../etl/utils";
import WarzoneMapper from "../etl/mapper";
import {GAMER_TABLE} from "../constants";
import ApiWrapper from '../api_wrapper';
import UtilityService from '../services/UtilityService';


export async function initializeGamer(queryGamer) {
	let API = await ApiWrapper.getInstance();
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