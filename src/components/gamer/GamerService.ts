import _ from 'lodash';

import HttpService from '../../services/HttpService';
import {GamerList} from './GamerTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export function getGamerPlatforms() {
    return [
        {
            id: 'xbl',
            name: 'Xbox Live',
            image: 'xbox'
        },
        {
            id: 'battle',
            name: 'Battle.net',
            image: 'battle'
        },
        {
            id: 'psn',
            name: 'Playstation Network',
            image: 'playstation'
        }
    ];
}



export async function getGamerDetailView(username: string, platform: string, view: string, gameCategory: string, baseUrl: string = null) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let dataUrl = (baseUrl || '') + '/api/gamer/' + platform + '/' + encodeURIComponent(username as string) + '?view=' + view + '&timeZone=' + timeZone + '&game_category=' + gameCategory;

    const response = await fetch(dataUrl);
    return await response.json();
}



export function getPlatformObjByID(platformCode) {
    return getGamerPlatforms().filter(({id}) => id === platformCode)[0];
}



export function queryGamers(query): Promise<GamerList> {
    return new Promise((resolve, reject) => {
        HttpService.http({
            method: 'GET',
            url: '/api/gamer',
            query
        }).then((response) => {
            if ([200, 204].includes(response.status)) {
                resolve(response.data.gamers);
            } else {
                reject(response);
            }
        }).catch(reject);
    });
}



export function minifyUsername(username) {
    const MAX_USERNAME_LENGTH = 12;
    let newUsername = username.split('#')[0];

    if (newUsername.length > MAX_USERNAME_LENGTH) {
        newUsername = newUsername.substr(0, MAX_USERNAME_LENGTH) + '\u2026';
    }

    return newUsername;
}



export function sanitizeStatKey(key) {
    let keywordMap = {
        'Avg': 'Average',
        'Kdr': 'KDR',
        'Num': 'Number of',
    };

    return key.split('_').map(_.capitalize).map((word) => keywordMap[word] || word).join(' ');
}



export default {
    getGamerPlatforms,
    getPlatformObjByID,
    minifyUsername,
    queryGamers,
    sanitizeStatKey,
    getGamerDetailView
};