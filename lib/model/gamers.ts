import ApiWrapper from '../api_wrapper';
import WarzoneMapper from '../etl/mapper';
import {insertDatabaseValues, queryDatabase, updateDatabaseValues} from '../database_utils';

import {TABLES, VIEWS} from '../constants';
import UtilityService from './../../src/services/UtilityService';

import {Gamer, RawGamer} from '../../src/components/gamer/GamerTypes';
import {AnyObject} from '../components/Types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export async function initializeGamer(queryGamer: AnyObject) {
    const API = await ApiWrapper.getInstance();
    const gamer = await API.MWwz(queryGamer.username, queryGamer.platform);
    const unoData = await API.MWcombatwzdate(queryGamer.username, 0, 0, queryGamer.platform);
    gamer.uno_id = unoData?.matches[0]?.player.uno;
    gamer.needs_backfill = true;
    return insertDatabaseValues(WarzoneMapper.mapGamer(gamer), TABLES.GAMERS);
}



export function updateGamer(query: AnyObject, gamer: Partial<Gamer>) {
    return updateDatabaseValues(query, gamer, TABLES.GAMERS);
}

export function queryFollowedGamers(query: AnyObject, options = {}) {
    query = UtilityService.validateItem(query, 'object', {});
    return queryDatabase(VIEWS.FOLLOW_GAMERS, query, options);
}

export function queryGamers(query: AnyObject, options = {}) {
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

    gamer.pretty_last_100_gulag_win_rate = UtilityService.numberToPercentage(gamer.last_100_rolling_average_gulag_kdr / (gamer.last_100_rolling_average_gulag_kdr + 1), 2);
    // gamer.pretty_last_100_gulag_win_rate = UtilityService.numberToPercentage(gamer.last_100_rolling_average_gulag_kdr / (gamer.last_100_rolling_average_gulag_kdr + 1), 1);
    gamer.last_100_kadr_kdr_difference = gamer.last_100_rolling_average_kadr - gamer.last_100_rolling_average_kdr;
    gamer.last_100_kadr_kdr_difference_percent = UtilityService.numberToPercentage(gamer.last_100_kadr_kdr_difference / gamer.last_100_rolling_average_kdr, 1);

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