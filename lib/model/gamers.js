import {insertIntoDatabase, queryDatabase, updateDatabaseRecords} from "../etl/utils";
import WarzoneMapper from "../etl/mapper";
import {GAMER_TABLE} from "../constants";
import {login} from '../api_wrapper';

export async function initializeGamer(queryGamer) {
    let API = await login();
    let gamer = await API.MWwz(queryGamer.username, queryGamer.platform);
    gamer.needs_backfill = true;
    return insertIntoDatabase(WarzoneMapper.mapGamer(gamer), GAMER_TABLE);
}

export function updateGamer(query, gamer){
    return updateDatabaseRecords(query, gamer, GAMER_TABLE);
}

export function queryGamers(query = null){
    if(!query){
        query = {}
    }
    return queryDatabase(GAMER_TABLE, query)
}