import {insertIntoDatabase, queryDatabase, updateDatabaseRecords} from "../etl/utils";
import WarzoneMapper from "../etl/mapper";
import {GAMER_TABLE} from "../constants";
import ApiWrapper from '../api_wrapper';
import UtilityService from '../../services/UtilityService';


export async function initializeGamer(queryGamer) {
	let API = await ApiWrapper.getInstance();
	let gamer = await API.MWwz(queryGamer.username, queryGamer.platform);
	gamer.needs_backfill = true;
	return insertIntoDatabase(WarzoneMapper.mapGamer(gamer), GAMER_TABLE);
}


export function updateGamer(query, gamer) {
	return updateDatabaseRecords(query, gamer, GAMER_TABLE);
}


export function queryGamers(query, options={}) {
	query = UtilityService.validateItem(query, 'object', {});
	return queryDatabase(GAMER_TABLE, query, options);
}



export function sanitizeSquad(squad) {
	squad = UtilityService.validateItem(squad, 'object', {});
	squad.gulag_win_rate = (UtilityService.validateItem(squad.gulag_win_rate, 'number', 0).toFixed(4) * 100).toFixed(2) + '%';
	squad.kdr = parseFloat((UtilityService.validateItem(squad.kdr, 'number', 0).toFixed(4)));
	return squad;
}

export function sanitizeGamer(gamer) {
	gamer = UtilityService.validateItem(gamer, 'object', {});
	gamer.gulag_win_rate = (UtilityService.validateItem(gamer.gulag_win_rate, 'number', 0).toFixed(4) * 100).toFixed(2) + '%';
	gamer.kdr = (UtilityService.validateItem(gamer.kdr, 'number', 0).toFixed(4)).toString();
	gamer.aliases = UtilityService.validateItem(gamer.aliases, 'array', []);

	return gamer;
}

export function sanitizeTeammates(teammates, filterKeys: string[] = []) {
	return teammates.map((teammate) => {
		teammate = sanitizeGamer(teammate);
		teammate.helping_player = {
			name: teammate.helping_player,
			platform: teammate.helping_player_platform
		};
		delete teammate.helping_player_platform;
		filterKeys.forEach((key)=>{
			delete teammate[key];
		})
		return teammate;
	});
}