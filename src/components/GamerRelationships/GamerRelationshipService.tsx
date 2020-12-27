import StorageService from './../Storage/StorageService';
import HttpService from '../../services/HttpService';

import {GamerRelationship, GamerRelationshipList, RawGamerRelationship} from './GamerRelationshipTypes';
import UtilityService from '../../services/UtilityService';
import TypeService from '../../services/TypeService';

const USER_GAMER_RELATIONSHIPS_STORAGE_KEY = 'user-gamer-relationships';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export function createGamerRelationship(gamerRelationship: Partial<RawGamerRelationship>, options?: { refresh: boolean }): Promise<GamerRelationship> {
    return new Promise((resolve, reject) => {
        HttpService.http({
            method: 'POST',
            url: '/api/v1/gamer-relationship',
            body: {
                gamerRelationship
            }
        }).then((response) => {
            if (response.status === 200) {
                StorageService.remove(USER_GAMER_RELATIONSHIPS_STORAGE_KEY);

                resolve(response.data);
            } else {
                reject(response);
            }
        }).catch(reject);
    });
}


export function sanitizeGamerRelationship(gamerRelationship) {
    return gamerRelationship;
}


export function isValidType(type) {
    return getValidTypes().includes(type);
}


export function getValidTypes() {
    return ['self', 'friend'];
}



export function queryGamerRelationships(query: Record<any, unknown>, options?: { refresh: boolean }): Promise<GamerRelationshipList> {
    return new Promise((resolve, reject) => {
        options = UtilityService.validateItem(options, 'object', {});

        let storedRelationships = StorageService.get(USER_GAMER_RELATIONSHIPS_STORAGE_KEY);

        if (options.refresh !== true && TypeService.isArray(storedRelationships, true)) {
            resolve(storedRelationships);
        } else {
            HttpService.http({
                method: 'GET',
                url: '/api/v1/gamer-relationship',
                query
            }).then((response) => {
                if ([200, 204].includes(response.status)) {
                    let gamerRelationships = UtilityService.validateItem(response.data, 'array', []).map(sanitizeGamerRelationship);
                    StorageService.save(USER_GAMER_RELATIONSHIPS_STORAGE_KEY, gamerRelationships, {session: true});
                    resolve(gamerRelationships);
                } else {
                    reject(response);
                }
            }).catch(reject);
        }
    });
}



export default {
    createGamerRelationship,
    sanitizeGamerRelationship,
    queryGamerRelationships,
    isValidType,
    getValidTypes
};