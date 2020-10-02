//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


function getGamerPlatforms() {
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
    ]
}

export {getGamerPlatforms};


function getPlatformObjByID(platformCode) {
    return getGamerPlatforms().filter(({id}) => id === platformCode)[0];
}
export {getPlatformObjByID};


export default {
    getGamerPlatforms: <Function>getGamerPlatforms,
    getPlatformObjByID: <Function>getPlatformObjByID
};