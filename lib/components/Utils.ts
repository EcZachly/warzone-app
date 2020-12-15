import {VIEWS} from "../constants";


export function restKeyToSQLView(key: string){
    const viewMap = {
        'teammates': VIEWS.TEAMMATES,
        'placements': VIEWS.GRADED_STATS,
        'stats': VIEWS.GRADED_STATS,
        'time': VIEWS.TIME_ANALYSIS,
        'squads': VIEWS.SQUADS,
        'trends': VIEWS.TREND_ANALYSIS,
        'recent_matches': VIEWS.GAMER_MATCHES_AUGMENTED,
        'relationships': VIEWS.MUTUAL_BENEFIT_RELATIONSHIPS
    };
    return viewMap[key];
}

export function restToMassiveQuery(view: string, params: object){
    let userQuery;

    // if params specifies username exactly, then we query for it
    if(params['username']){
        userQuery = {
            username: params['username'],
            platform: params['platform']
        };
    }
    // otherwise it's probably a LIKE match
    else{
        userQuery = params;
    }
    const userString = '%' + params['platform'] + '-' + params['username'] + '%';
    const squadQuery = {'team_grain LIKE': userString};
    const timezoneQuery = {
        timezone: params['timeZone'] || 'America/Los_Angeles',
        cutoff: '10'
    };
    const trendQuery = {lookback: parseFloat(params['lookback'] as string) || 30};

    const queries = {
        [VIEWS.PLAYER_STAT_SUMMARY]: userQuery,
        [VIEWS.GAMER_CLASS_DESCRIPTIONS]: {},
        [VIEWS.GRADED_STATS]: userQuery,
        [VIEWS.TEAMMATES]: userQuery,
        [VIEWS.TIME_ANALYSIS]: {...userQuery, ...timezoneQuery},
        [VIEWS.SQUADS]: squadQuery,
        [VIEWS.TREND_ANALYSIS]: {...userQuery, ...trendQuery},
        [VIEWS.GAMER_MATCHES_AUGMENTED]: userQuery,
        [VIEWS.MUTUAL_BENEFIT_RELATIONSHIPS]: userQuery
    }
    return queries[view]
}