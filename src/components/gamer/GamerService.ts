import _ from 'lodash';

import HttpService from '../../services/HttpService';
import {Gamer, GamerList} from './GamerTypes';

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
        },
        {
            id: 'uno',
            name: 'Activision Id',
            image: 'battle'
        },

    ];
}



export async function getGamerDetailView(username: string, platform: string, view: string, gameCategory: string, baseUrl: string = null): Promise<{gamer: Gamer, viewData: any, seoMetadata: any, classDescriptions: any}> {
    return new Promise((resolve, reject) => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const dataUrl = (baseUrl || '') + '/api/gamer/' + platform + '/' + encodeURIComponent(username as string) + '?view=' + view + '&timeZone=' + timeZone + '&game_category=' + gameCategory;

        HttpService.http({
            method: 'GET',
            url: dataUrl,
        }).then((response) => {
            if (response.status === 200) {
                resolve(response.data);
            } else {
                console.log(response);
                reject(new Error('an unknown error occurred while trying to get the gamer details'));
            }
        }).catch(reject);
    });
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



export function generatePlatformUsername(gamer) {
    return [gamer.username, gamer.platform].join('-');
}




export function getDefaultGameCategory() {
    return 'Warzone';
}



export function sanitizeStatKey(key) {
    const keywordMap = {
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
    generatePlatformUsername,
    getDefaultGameCategory,
    queryGamers,
    sanitizeStatKey,
    getGamerDetailView
};