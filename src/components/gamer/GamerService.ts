//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


function getGamerPlatforms() {
    return [
        {
            id: 'xbl',
            name: 'Xbox Live',
        },
        {
            id: 'battle',
            name: 'Battle.net',
        },
        {
            id: 'psn',
            name: 'Playstation Network',
        }
    ]
}

export {getGamerPlatforms};


export default {
    getGamerPlatforms: <Function>getGamerPlatforms
};