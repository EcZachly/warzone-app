import UtilityService from '../../../src/services/UtilityService';
import HttpService from '../../../src/services/HttpService';

import {GamerMatch, GamerMatchList} from './GamerMatchTypes';
import {MatchList} from '../Matches/MatchTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export function sanitizeGamerMatch(match: Partial<GamerMatch>): Partial<GamerMatch> {
    return match;
}



type queryGamerMatchesOptions = {
    order: any[],
    baseUrl?: string,
    limit?: number,
    offset?: number,
};


export async function queryGamerMatches(queryInput: Partial<GamerMatch>, options: queryGamerMatchesOptions): Promise<GamerMatchList> {
    return new Promise(async (resolve, reject) => {
        const query = UtilityService.validateItem(queryInput, 'object', {});

        const qualifiers = ['limit', 'offset', 'order'];

        qualifiers.forEach((key) => {
            if (options[key]) {
                query[key] = options[key];
            }
        });

        HttpService.http({
            method: 'GET',
            url: (options.baseUrl || '') + '/api/gamer-match',
            query: query
        }).then((response) => {
            if (response.status === 200 || response.status === 204) {
                resolve(UtilityService.validateItem(response.data, 'array', []).map(sanitizeGamerMatch));
            } else {
                reject(response);
            }
        }).catch(reject);
    });
}



export function combineGamerMatches(gamerMatches: GamerMatchList): MatchList {
    return Object.values(gamerMatches.reduce((matches, gamerMatch) => {
        const {match_id} = gamerMatch;

        matches[match_id] = UtilityService.validateItem(matches[match_id], 'object', gamerMatch);

        matches[match_id].gamers = UtilityService.validateItem(matches[match_id].gamers, 'array', []);
        matches[match_id].gamers.push(UtilityService.copyObject(gamerMatch));

        return matches;
    }, {}));
}



export default {
    sanitizeGamerMatch,
    queryGamerMatches,
    combineGamerMatches
};