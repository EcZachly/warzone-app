import UtilityService from '../../../src/services/UtilityService';
import HttpService from '../../../src/services/HttpService';

import {GamerMatchList, GamerMatch} from './GamerMatchTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export function sanitizeGamerMatch(match: Partial<GamerMatch>): Partial<GamerMatch> {
    return match;
}



export async function queryGamerMatches(queryInput: Partial<GamerMatch>, options: { baseUrl: string, limit?: number, offset?: number }): Promise<GamerMatchList> {
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
            url: options.baseUrl + '/api/gamer-match',
            query: query
        }).then((response) => {
            console.log(response);

            if (response.status === 200 || response.status === 204) {
                resolve(response.data.map(sanitizeGamerMatch));
            } else {
                reject(response);
            }
        }).catch(reject);
    });
}



export default {
    sanitizeGamerMatch,
    queryGamerMatches
};