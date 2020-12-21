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


export async function getGamerDetailView(username: string, platform: string, view: string, gameCategory:string){
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dataUrl =  '/api/gamer/' + platform + '/' + encodeURIComponent(username as string) + '?view=' + view + '&timeZone=' + timeZone + '&game_category=' + gameCategory;
    const response = await fetch(dataUrl);
    return await response.json();
}

export function getPlatformObjByID(platformCode) {
    return getGamerPlatforms().filter(({id}) => id === platformCode)[0];
}

export default {
    getGamerPlatforms,
    getPlatformObjByID,
    getGamerDetailView
};