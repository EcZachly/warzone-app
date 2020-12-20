import StorageService from './../Storage/StorageService';
import HttpService from '../../services/HttpService';

import {GamerRelationship, RawGamerRelationship, GamerRelationshipList} from './GamerRelationshipTypes';
import UtilityService from '../../services/UtilityService';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export function createGamerRelationship(gamerRelationship: Partial<RawGamerRelationship>): Promise<GamerRelationship> {
    return new Promise((resolve, reject) => {
        HttpService.http({
            method: 'POST',
            url: '/api/v1/gamer-relationship',
            body: {
                gamerRelationship
            }
        }).then((response) => {
            if (response.status === 200) {
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



export function queryGamerRelationships(query: Record<any, unknown>, options?: Record<any, unknown>): Promise<GamerRelationshipList> {
    return new Promise((resolve, reject) => {
        HttpService.http({
            method: 'GET',
            url: '/api/v1/gamer-relationship',
            query
        }).then((response) => {
            if ([200, 204].includes(response.status)) {
                resolve(UtilityService.validateItem(response.data, 'array', []).map(sanitizeGamerRelationship));
            } else {
                reject(response);
            }
        }).catch(reject);
    });
}



export default {
    createGamerRelationship,
    sanitizeGamerRelationship,
    queryGamerRelationships,
    isValidType,
    getValidTypes
};