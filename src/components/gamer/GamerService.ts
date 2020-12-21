import {GamerList} from './GamerTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


import HttpService from '../../services/HttpService';
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


export async function getGamerDetailView(username: string, platform: string, view: string, gameCategory:string, baseUrl: string = null){
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let dataUrl =  '/api/gamer/' + platform + '/' + encodeURIComponent(username as string) + '?view=' + view + '&timeZone=' + timeZone + '&game_category=' + gameCategory;
    if(baseUrl){
        dataUrl = baseUrl + dataUrl;
    }
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



export default {
    getGamerPlatforms,
    getPlatformObjByID,
    queryGamers,
    getGamerDetailView
};