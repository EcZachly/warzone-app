import {insertIntoDatabase, queryDatabase, updateDatabaseRecords} from '../etl/utils';
import WarzoneMapper from '../etl/mapper';
import {TABLES} from '../constants';
import ApiWrapper from '../api_wrapper';
import UtilityService from './../../src/services/UtilityService';
import {Gamer} from '../../src/components/gamer/GamerTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export async function initializeGamer(queryGamer) {
    const API = await ApiWrapper.getInstance();
    const gamer = await API.MWwz(queryGamer.username, queryGamer.platform);
    const unoData = await API.MWcombatwzdate(queryGamer.username, 0,0, queryGamer.platform);
    gamer.uno_id = unoData.matches[0].player.uno;
    gamer.needs_backfill = true;
    return insertIntoDatabase(WarzoneMapper.mapGamer(gamer), TABLES.GAMERS);
}






export function updateGamer(query: object, gamer: Partial<Gamer>) {
    return updateDatabaseRecords(query, gamer, TABLES.GAMERS);
}



export function queryGamers(query, options = {}) {
    query = UtilityService.validateItem(query, 'object', {});
    return queryDatabase(TABLES.GAMERS, query, options);
}


export function sanitizeGamer(gamer) {
    gamer = UtilityService.validateItem(gamer, 'object', {});

    gamer.pretty_gulag_win_rate = (UtilityService.validateItem(gamer.gulag_win_rate, 'number', 0).toFixed(4) * 100).toFixed(2) + '%';
    gamer.gulag_kdr = UtilityService.round((1 / (1 - UtilityService.validateItem(gamer.gulag_win_rate, 'number', 0))) - 1, 2);
    gamer.kdr = (UtilityService.validateItem(gamer.kdr, 'number', 0).toFixed(4)).toString();
    gamer.aliases = UtilityService.validateItem(gamer.aliases, 'array', []);
    gamer.heat_score = (gamer.last_10_rolling_average_kdr / gamer.last_100_rolling_average_kdr - 1) * 100;

    return gamer;
}


const TEAMMATE_FILTER_KEYS = ['username', 'platform', 'aliases'];
export function sanitizeTeammates(teammates) {
    return teammates.map((teammate) => {
        teammate = sanitizeGamer(teammate);
        teammate.helping_player = {
            name: teammate.helping_player,
            platform: teammate.helping_player_platform
        };
        delete teammate.helping_player_platform;
        TEAMMATE_FILTER_KEYS.forEach((key) => {
            delete teammate[key];
        });
        return teammate;
    });
}