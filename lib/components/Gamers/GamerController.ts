import {GAME_CATEGORIES, VIEWS} from '../../constants';
import {ViewQuery} from '../../model/view_query';
import {sanitizeGamer, sanitizeTeammates} from '../../model/gamers';
import {SquadService} from '../Squads';
import {restToMassiveQuery} from '../Utils';

import {Gamer, GamerPlatform} from '../../../src/components/gamer/GamerTypes';
import {GamerClassDescription} from '../Classes/ClassDescriptionType';
import {AnyObject} from '../Types';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export async function getGamerClassDescriptions(): Promise<GamerClassDescription> {
    const query = getGamerDetailViewQuery(VIEWS.GAMER_CLASS_DESCRIPTIONS, {}, {});
    await query.executeQuery();
    return query.data as GamerClassDescription;
}



export async function getSingleGamerData(username: string, platform: GamerPlatform, game_category = GAME_CATEGORIES.WARZONE): Promise<Gamer> {
    const val = getGamerDetailViewQuery(VIEWS.GAMER_STAT_SUMMARY, {username, game_category, platform}, {});
    console.log(val);
    await val.executeQuery();
    console.log(val);
    return val.data[0] as Gamer;
}



export function getGamerDetailViewQuery(view: string, allParams: AnyObject = {}, options: AnyObject = {}): ViewQuery {
    const query = restToMassiveQuery(view, allParams);

    const queryableViews = {
        [VIEWS.GAMER_INFLUENCE_RELATIONSHIPS]: new ViewQuery(VIEWS.GAMER_INFLUENCE_RELATIONSHIPS, query, options),
        [VIEWS.GAMER_STAT_SUMMARY]: new ViewQuery(VIEWS.GAMER_STAT_SUMMARY, query, options, (data) => data.map(sanitizeGamer)),
        [VIEWS.GAMER_CLASS_DESCRIPTIONS]: new ViewQuery(VIEWS.GAMER_CLASS_DESCRIPTIONS, {}),
        [VIEWS.GRADED_STATS]: new ViewQuery(VIEWS.GRADED_STATS, query),
        [VIEWS.TIME_ANALYSIS]: new ViewQuery(VIEWS.TIME_ANALYSIS, query),
        [VIEWS.SQUADS]: new ViewQuery(VIEWS.SQUADS, query, {}, (data) => data.map(SquadService.sanitizeSquad)),
        [VIEWS.TREND_ANALYSIS]: new ViewQuery(VIEWS.TREND_ANALYSIS, query),
        [VIEWS.GAMER_MATCHES_AUGMENTED]: new ViewQuery(VIEWS.GAMER_MATCHES_AUGMENTED, query, {
            limit: 10,
            order: [{
                field: 'start_timestamp',
                direction: 'desc',
                nulls: 'last'
            }]
        })
    };

    return queryableViews[view as string];
}



export default {
    getGamerClassDescriptions,
    getSingleGamerData,
    getGamerDetailViewQuery
};