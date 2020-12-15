import {VIEWS} from "../../constants";
import {ViewQuery} from "../../model/view_query";
import {sanitizeGamer, sanitizeTeammates} from "../../model/gamers";
import {SquadService} from "../Squads";
import {restToMassiveQuery} from "../Utils";

export * from './../../../src/components/gamer/GamerService';
export {default} from './../../../src/components/gamer/GamerService';


export const getGamerDetailViewQuery = (view: string, allParams:object={}, options:object={}) : ViewQuery => {
    let query = restToMassiveQuery(view, allParams)
    const queryableViews = {
        [VIEWS.MUTUAL_BENEFIT_RELATIONSHIPS]:  new ViewQuery(VIEWS.MUTUAL_BENEFIT_RELATIONSHIPS, query, options),
        [VIEWS.PLAYER_STAT_SUMMARY]: new ViewQuery(VIEWS.PLAYER_STAT_SUMMARY, query, options, (data) => data.map(sanitizeGamer)),
        [VIEWS.GAMER_CLASS_DESCRIPTIONS]: new ViewQuery(VIEWS.GAMER_CLASS_DESCRIPTIONS, {}),
        [VIEWS.GRADED_STATS]: new ViewQuery(VIEWS.GRADED_STATS, query),
        [VIEWS.TEAMMATES]: new ViewQuery(VIEWS.TEAMMATES, query, {}, (data) => sanitizeTeammates(data)),
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
    }
    return queryableViews[view as string]
}