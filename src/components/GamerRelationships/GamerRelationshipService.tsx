import StorageService from './../Storage/StorageService';
import HttpService from '../../services/HttpService';

import {GamerRelationship, GamerRelationshipList, RawGamerRelationship} from './GamerRelationshipTypes';
import UtilityService from '../../services/UtilityService';
import TypeService from '../../services/TypeService';
import {UserService} from '../Users';

const USER_GAMER_RELATIONSHIPS_STORAGE_KEY = 'user-gamer-relationships';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export async function createGamerRelationship(gamerRelationship: Partial<RawGamerRelationship>): Promise<GamerRelationship> {
    return new Promise((resolve, reject) => {
        HttpService.http({
            method: 'POST',
            url: '/api/v1/gamer-relationship',
            body: {
                gamerRelationship
            }
        }).then(async (response) => {
            if (response.status === 200) {
                StorageService.remove(USER_GAMER_RELATIONSHIPS_STORAGE_KEY, {session: true});
                await queryGamerRelationships({user_id: UserService.getUser().user_id}).finally();

                resolve(response.data);
            } else {
                reject(response);
            }
        }).catch(reject);
    });
}


export async function removeGamerRelationship(gamerRelationship: Partial<RawGamerRelationship>): Promise<GamerRelationship> {
    return new Promise((resolve, reject) => {
        HttpService.http({
            method: 'DELETE',
            url: '/api/v1/gamer-relationship',
            body: {
                gamerRelationship
            }
        }).then(async (response) => {
            if (response.status === 200) {
                StorageService.remove(USER_GAMER_RELATIONSHIPS_STORAGE_KEY, {session: true});
                await queryGamerRelationships({user_id: UserService.getUser().user_id}).finally();

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



export async function queryGamerRelationships(query: Record<any, unknown>, options?: { refresh: boolean }): Promise<GamerRelationshipList> {
    return new Promise((resolve, reject) => {
        options = UtilityService.validateItem(options, 'object', {});

        let storedRelationships = getGamerRelationshipsFromStorage();

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


export function getGamerRelationshipsFromStorage() {
    return UtilityService.validateItem(StorageService.get(USER_GAMER_RELATIONSHIPS_STORAGE_KEY, {session: true}), 'array', []);
}



export default {
    createGamerRelationship,
    removeGamerRelationship,
    sanitizeGamerRelationship,
    getGamerRelationshipsFromStorage,
    queryGamerRelationships,
    isValidType,
    getValidTypes
};