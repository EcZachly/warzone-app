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
    getGamerPlatforms: getGamerPlatforms,
    getPlatformObjByID: getPlatformObjByID,
    queryGamers: queryGamers
};