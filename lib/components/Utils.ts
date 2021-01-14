import {TABLES, VIEWS} from '../constants';


export function getQueryParamToSQLMap() {
    return {
        'teammates': VIEWS.MUTUAL_BENEFIT_RELATIONSHIPS,
        'placements': VIEWS.GRADED_STATS,
        'stats': VIEWS.GRADED_STATS,
        'time': VIEWS.TIME_ANALYSIS,
        'squads': VIEWS.SQUADS,
        'trends': VIEWS.TREND_ANALYSIS,
        'recent_matches': VIEWS.GAMER_MATCHES_AUGMENTED
    };
}

export function restToMassiveQuery(view: string, params: object){
    let userQuery = params;

    // if params specifies username exactly, then we query for it
    if(params['username']) {
        userQuery = {
            username: params['username'],
            platform: params['platform']
        }
    }
    let gameCategoryQuery = {
        game_category: params['game_category']
    };

    const squadQuery = {'team_grain LIKE': `%${params['platform']}-${params['username']}%`};

    const timezoneQuery = {
        timezone: params['timeZone'] || 'America/Los_Angeles',
        cutoff: '10'
    };

    const trendQuery = {lookback: parseFloat(params['lookback'] as string) || 30};
    const queries = {
        [VIEWS.PLAYER_STAT_SUMMARY]: {...userQuery, ...gameCategoryQuery},
        [VIEWS.GAMER_CLASS_DESCRIPTIONS]: {},
        [VIEWS.GRADED_STATS]: {...userQuery, ...gameCategoryQuery},
        [VIEWS.TEAMMATES]: {...userQuery, ...gameCategoryQuery},
        [VIEWS.TIME_ANALYSIS]: {...userQuery, ...timezoneQuery, ...gameCategoryQuery},
        [VIEWS.SQUADS]: {...squadQuery, ...gameCategoryQuery},
        [VIEWS.TREND_ANALYSIS]: {...userQuery, ...trendQuery, ...gameCategoryQuery},
        [VIEWS.GAMER_MATCHES_AUGMENTED]: {...userQuery, ...gameCategoryQuery},
        [VIEWS.MUTUAL_BENEFIT_RELATIONSHIPS]: {...userQuery, ...gameCategoryQuery}

    };
    return queries[view];
}