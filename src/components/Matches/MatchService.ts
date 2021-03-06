import UtilityService from '../../../src/services/UtilityService';
import HttpService from '../../../src/services/HttpService';

import {Match, MatchList} from './MatchTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export function sanitizeMatch(match: Partial<Match>): Partial<Match> {
    return match;
}



export async function queryMatches(queryInput: Partial<Match>, options: { baseUrl: string, limit?: number, offset?: number }): Promise<MatchList> {
    return new Promise(async (resolve, reject) => {
        options = UtilityService.validateItem(options, 'object', {});
        options.baseUrl = UtilityService.validateItem(options.baseUrl, 'string', '');


        const query = UtilityService.validateItem(queryInput, 'object', {});

        if (options.limit) {
            query.limit = options.limit;
        }

        if (options.offset) {
            query.offset = options.offset;
        }

        HttpService.http({
            method: 'GET',
            url: options.baseUrl + '/api/match',
            query: query
        }).then((response) => {
            console.log(response);

            if (response.status === 200 || response.status === 204) {
                resolve(response.data.map(sanitizeMatch));
            } else {
                reject(response);
            }
        }).catch(reject);
    });
}



export default {
    sanitizeMatch,
    queryMatches
};