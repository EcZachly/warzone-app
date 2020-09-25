import {NextApiRequest, NextApiResponse} from 'next'

import {ViewQuery} from "../../../../../lib/model/view_query";
import {updateGamer, queryGamers, sanitizeGamer, sanitizeTeammates} from "../../../../../lib/model/gamers";
import Bluebird from 'bluebird';
import _ from 'lodash';
let FILTER_KEYS = ['username', 'platform', 'helping_player_temp', 'helping_player_platform',  'aliases'];

function columnToDisplayName(column: string) {
    return column.split('_').map(_.capitalize).join(' ');
}

async function updateGamerUponRequest(gamerData){
    let gamerPromise = Bluebird.resolve(gamerData);
    if (!gamerData.needs_update) {
        gamerData.needs_update = true;
        gamerPromise = updateGamer({username: gamerData.username, platform: gamerData.platform}, gamerData);
    }
    return await gamerPromise;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    let {view, username, platform } = req.query;


    let userQuery = {
        username: username,
        platform: platform
    };
    let timezoneQuery = {
        timezone: 'America/Los_Angeles',
        cutoff: "10"
    };

    let queryableViews = [
        new ViewQuery('player_stat_summary', userQuery),
        new ViewQuery('gamer_stats_graded', userQuery),
        new ViewQuery('teammate_analysis', userQuery),
        new ViewQuery('time_of_day_analysis', {...userQuery, ...timezoneQuery}),
        new ViewQuery('day_of_week_analysis', {...userQuery, ...timezoneQuery}),
    ]

    let viewNamesToQuery = ['player_stat_summary', view as string];
    let viewsToQuery = queryableViews.filter((v: ViewQuery)=> viewNamesToQuery.includes(v.view));

    let gamerList = await queryGamers({username: username, platform: platform});
    let gamerData = gamerList[0]
    // Only try to fetch all the expensive view data if the gamer exists
    if(gamerData){
        let gamerMatchDataPromises = viewsToQuery.map(async (view: ViewQuery) => await view.executeQuery());
        Bluebird.all(gamerMatchDataPromises).then(async () => {
            let gamer = sanitizeGamer(viewsToQuery[0].data[0]);
            let viewData = viewsToQuery[1].data;
            if(view as string === 'teammate_analysis'){
                viewData = {
                    teammates: sanitizeTeammates(viewData),
                    titleKeys: Object.keys(viewData[0]).filter((key) => !FILTER_KEYS.includes(key)).map(columnToDisplayName)
                };
            }
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
    }
    else{
        res.json({
            errorMessage: username + ' on platform: ' + platform + ' was not found!'
        })
    }
}