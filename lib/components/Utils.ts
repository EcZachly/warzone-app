import {TABLES, VIEWS} from '../constants';


export function getQueryParamToSQLMap() {
    return {
        'teammates': VIEWS.GAMER_INFLUENCE_RELATIONSHIPS,
        'placements': VIEWS.GRADED_STATS,
        'stats': VIEWS.GRADED_STATS,
        'overview': null,
        'time': VIEWS.TIME_ANALYSIS,
        'squads': VIEWS.SQUADS,
        'trends': VIEWS.TREND_ANALYSIS,
        'recent_matches': VIEWS.GAMER_MATCHES_AUGMENTED
    };
}

export function restToMassiveQuery(view: string, params: Record<any, unknown>) {
    let userQuery = params;

    // if params specifies uno_id exactly, then we query for it
    if (params['uno_id']) {
        userQuery = {
            uno_id: params['uno_id']
        };
    }

    const gameCategoryQuery = {
        game_category: params['game_category']
    };

    const squadQuery = {'team_grain LIKE': `%${params['platform']}-${params['username']}%`};

    const timezoneQuery = {
        timezone: params['timeZone'] || 'America/Los_Angeles',
        cutoff: '10'
    };

    const trendQuery = {lookback: parseFloat(params['lookback'] as string) || 30};

    const queries = {
        [VIEWS.GAMER_STAT_SUMMARY]: {...userQuery, ...gameCategoryQuery},
        [VIEWS.GAMER_CLASS_DESCRIPTIONS]: {},
        [VIEWS.GRADED_STATS]: {...userQuery, ...gameCategoryQuery},
        [VIEWS.TIME_ANALYSIS]: {...userQuery, ...timezoneQuery, ...gameCategoryQuery},
        [VIEWS.SQUADS]: {...squadQuery, ...gameCategoryQuery},
        [VIEWS.TREND_ANALYSIS]: {...userQuery, ...trendQuery, ...gameCategoryQuery},
        [VIEWS.GAMER_MATCHES_AUGMENTED]: {...userQuery, ...gameCategoryQuery},
        [VIEWS.GAMER_INFLUENCE_RELATIONSHIPS]: {...userQuery, ...gameCategoryQuery}
    };

    return queries[view];
}