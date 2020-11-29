import UtilityService from '../../../src/services/UtilityService';
import HttpService from '../../../src/services/HttpService';

import {RawSquad, SquadList, Squad} from './SquadTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export function sanitizeSquad(squad: Partial<Squad>): Partial<Squad> {
    squad.gulag_win_rate = UtilityService.validateItem(squad.gulag_win_rate, 'number', 0);
    squad.pretty_gulag_win_rate = (squad.gulag_win_rate * 100).toFixed(2) + '%';
    squad.kdr = parseFloat((UtilityService.validateItem(squad.kdr, 'number', 0).toFixed(4)));

    return squad;
}



export async function querySquads(queryInput: Partial<Squad>, options: { baseUrl: string, limit?: number, offset?: number }): Promise<SquadList> {
    return new Promise(async (resolve, reject) => {
        options = UtilityService.validateItem(options, 'object', {});
        options.baseUrl = UtilityService.validateItem(options.baseUrl, 'string', '');


        let query = UtilityService.validateItem(queryInput, 'object', {});

        if (options.limit) {
            query.limit = options.limit;
        }

        if (options.offset) {
            query.offset = options.offset;
        }

        HttpService.http({
            method: 'GET',
            url: options.baseUrl + '/api/squad',
            query: query
        }).then((response) => {
            console.log(response);

            if (response.status === 200 || response.status === 204) {
                resolve(response.data.squads.map(sanitizeSquad));
            } else {
                reject(response);
            }
        }).catch(reject);
    });
}



export default {
    sanitizeSquad,
    querySquads
};