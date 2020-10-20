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


export function getPlatformObjByID(platformCode) {
    return getGamerPlatforms().filter(({id}) => id === platformCode)[0];
}



export function getClassConfigurations() {
    return {
        aggressor: {
            name: 'Aggressive',
            group: 'kills-per-minute',
            description: 'AGRESSIVE DESCRIPTION',
            needsUpdate: true
        },
        scratched: {
            name: 'Scratched',
            description: 'SCRATCHED DESCRIPTION',
            needsUpdate: true
        },
        nomad: {
            name: 'nomad',
            description: 'nomad DESCRIPTION',
            needsUpdate: true
        },
        deadeye: {
            name: 'deadeye',
            description: 'deadeye DESCRIPTION',
            needsUpdate: true
        },
        tomb_raider: {
            name: 'tomb_raider',
            description: 'tomb_raider DESCRIPTION',
            needsUpdate: true
        },
        seal: {
            name: 'seal',
            description: 'seal DESCRIPTION',
            needsUpdate: true
        },
        dancer: {
            name: 'dancer',
            description: 'dancer DESCRIPTION',
            needsUpdate: true
        },
        elephant: {
            name: 'elephant',
            description: 'elephant DESCRIPTION',
            needsUpdate: true
        },
        vanquisher: {
            name: 'vanquisher',
            description: 'vanquisher DESCRIPTION',
            needsUpdate: true
        },
        warmonger: {
            name: 'warmonger',
            description: 'warmonger DESCRIPTION',
            needsUpdate: true
        },
        bullet_sponge: {
            name: 'bullet_sponge',
            description: 'bullet_sponge DESCRIPTION',
            needsUpdate: true
        },
        wanderer: {
            name: 'wanderer',
            description: 'wanderer DESCRIPTION',
            needsUpdate: true
        },
        headshot_hacker: {
            name: 'headshot_hacker',
            description: 'headshot_hacker DESCRIPTION',
            needsUpdate: true
        },
        looter: {
            name: 'looter',
            description: 'looter DESCRIPTION',
            needsUpdate: true
        },
        slug: {
            name: 'slug',
            description: 'slug DESCRIPTION',
            needsUpdate: true
        },
        goldfish: {
            name: 'goldfish',
            description: 'goldfish DESCRIPTION',
            needsUpdate: true
        },
        conqueror: {
            name: 'conqueror',
            description: 'conqueror DESCRIPTION',
            needsUpdate: true
        },
        peacemaker: {
            name: 'peacemaker',
            description: 'peacemaker',
            needsUpdate: true
        },
        trainee: {
            name: 'trainee',
            description: 'trainee',
            needsUpdate: true
        },
        scavenger: {
            name: 'scavenger',
            description: 'scavenger',
            needsUpdate: true
        },
        field_agent: {
            name: 'field_agent',
            description: 'field_agent',
            needsUpdate: true
        },
        statue: {
            name: 'statue',
            description: 'statue',
            needsUpdate: true
        },
        surrenderer: {
            name: 'surrenderer',
            description: 'surrenderer',
            needsUpdate: true
        },
        traveller: {
            name: 'traveller',
            description: 'traveller',
            needsUpdate: true
        },
        tortoise: {
            name: 'tortoise',
            description: 'tortoise',
            needsUpdate: true
        },
        uninjured: {
            name: 'uninjured',
            description: 'uninjured',
            needsUpdate: true
        },
        pirate: {
            name: 'pirate',
            description: 'pirate',
            needsUpdate: true
        },
        secret_agent: {
            name: 'secret_agent',
            description: 'secret_agent',
            needsUpdate: true
        },
        lemming: {
            name: 'lemming',
            description: 'lemming',
            needsUpdate: true
        },
        hummingbird: {
            name: 'hummingbird',
            description: 'hummingbird',
            needsUpdate: true
        },
        camper: {
            name: 'camper',
            description: 'camper',
            needsUpdate: true
        },
        pacifist: {
            name: 'pacifist',
            description: 'pacifist',
            needsUpdate: true
        },
        intern: {
            name: 'intern',
            description: 'intern',
            needsUpdate: true
        }
    };
}



export function getClassConfigurationByID(gamerClassName) {
    const classList = getClassConfigurations();
    let matchingClassConfig = classList[gamerClassName];

    if (matchingClassConfig) {
        return matchingClassConfig;
    } else {
        throw new Error('No class config was found by that ID');
    }
}


export default {
    getGamerPlatforms: getGamerPlatforms,
    getPlatformObjByID: getPlatformObjByID,
    getClassConfigurations: getClassConfigurations,
    getClassConfigurationByID: getClassConfigurationByID
};