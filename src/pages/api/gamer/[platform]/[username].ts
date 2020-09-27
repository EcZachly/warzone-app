import {NextApiRequest, NextApiResponse} from 'next'

import {ViewQuery} from "../../../../../lib/model/view_query";
import DefaultMiddleware from '../../../../middleware/default_middleware';
import {updateGamer, queryGamers, sanitizeGamer, sanitizeTeammates} from "../../../../../lib/model/gamers";
import Bluebird from 'bluebird';

let TEAMMATE_FILTER_KEYS = ['username', 'platform', 'aliases'];

async function updateGamerUponRequest(gamerData) {
    let gamerPromise = Bluebird.resolve(gamerData);
    if (!gamerData.needs_update) {
        gamerData.needs_update = true;
        gamerPromise = updateGamer({username: gamerData.username, platform: gamerData.platform}, gamerData);
    }
    return await gamerPromise;
}

const gamerDetail = async (req: NextApiRequest, res: NextApiResponse) => {
    let {view, timeZone, username, platform} = req.query;

    let viewMap = {
        'teammates': 'teammate_analysis',
        'placements': 'gamer_stats_graded',
        'stats': 'gamer_stats_graded',
        'time': 'time_analysis'
    };

    let sqlView = viewMap[view as string];

    let userQuery = {
        username: username,
        platform: platform
    };
    let timezoneQuery = {
        timezone: timeZone || 'America/Los_Angeles',
        cutoff: "10"
    };

    let queryableViews = [
        new ViewQuery('player_stat_summary', userQuery),
        new ViewQuery('gamer_stats_graded', userQuery),
        new ViewQuery('teammate_analysis', userQuery),
        new ViewQuery('time_analysis', {...userQuery, ...timezoneQuery})
    ]

    let viewNamesToQuery = ['player_stat_summary', sqlView as string];
    let viewsToQuery = queryableViews.filter((v: ViewQuery) => viewNamesToQuery.includes(v.view));

    let gamerList = await queryGamers({username: username, platform: platform});
    let gamerData = gamerList[0]
    let gamerExists = !!gamerData;
    if (gamerExists) {
        let gamerMatchDataPromises = viewsToQuery.map(async (view: ViewQuery) => await view.executeQuery());
        Bluebird.all(gamerMatchDataPromises).then(async () => {
            let gamer = sanitizeGamer(viewsToQuery[0].data[0]);
            let viewData = viewsToQuery[1].data;
            let sanitizationLookup = {
                'gamer_stats_graded': () => viewData,
                'time_analysis': () => viewData,
                'teammate_analysis': () => sanitizeTeammates(viewData, TEAMMATE_FILTER_KEYS)
            }
            viewData = sanitizationLookup[sqlView]();
            await updateGamerUponRequest(gamerData);
            let seoMetadata = {
                title: 'Warzone stats for ' + gamer.username,
                keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
                description: 'KDR: ' + gamer.kdr + ' Gulag Win Rate: ' + gamer.gulag_win_rate
            };
            res.json({
                gamer: gamer,
                viewData: viewData,
                seoMetadata: seoMetadata
            })
        })
    } else {
        res.json({
            errorMessage: username + ' on platform: ' + platform + ' was not found!'
        })
    }
}

export default DefaultMiddleware(gamerDetail)