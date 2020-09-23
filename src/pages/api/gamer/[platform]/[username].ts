import {NextApiRequest, NextApiResponse} from 'next'
import {queryView} from "../../../../../lib/model/analysis";
import UtilityService from "../../../../../lib/services/UtilityService";
import {updateGamer, queryGamers} from "../../../../../lib/model/gamers";
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
let FILTER_KEYS = ['shooting_player', 'shooting_player_platform', 'helping_player_temp', 'helping_player_platform', 'shooting_player_temp'];


function columnToDisplayName(column: string) {
    return column.split('_').map(_.capitalize).join(' ');
}

function sanitizeGamer(gamer) {
    gamer = UtilityService.validateItem(gamer, 'object', {});
    gamer.gulag_win_rate = (UtilityService.validateItem(gamer.gulag_win_rate, 'number', 0).toFixed(4) * 100).toFixed(2) + '%';
    gamer.kdr = (UtilityService.validateItem(gamer.kdr, 'number', 0).toFixed(4)).toString();
    gamer.aliases = UtilityService.validateItem(gamer.aliases, 'array', []);
    return gamer;
}

function sanitizeTeammates(teammates) {
    return teammates.map((teammate) => {
        teammate = sanitizeGamer(teammate);
        teammate.helping_player = {
            name: teammate.helping_player,
            platform: teammate.helping_player_platform
        };
        return teammate;
    });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    let {view, username, platform } = req.query;
    let queriedViews = (view as string).split(',');
    let defaultViews = ['player_stat_summary'];
    let views = {
        'player_stat_summary': {
            query: {
                username: username,
                platform: platform
            }
        },
        'teammate_analysis': {
            query: {
                shooting_player: req.query.username,
                shooting_player_platform: req.query.platform
            }
        },
        'gamer_stats_graded': {
            query: {
                username: req.query.username,
                platform: req.query.platform
            }
        },
        'gamers': {
            query: {
                username: req.query.username,
                platform: req.query.platform
            }
        },
        'time_of_day_analysis': {
            query: {
                timezone: 'America/Los_Angeles',
                username: req.query.username,
                platform: req.query.platform,
                cutoff: "10"
            }
        },
        'day_of_week_analysis': {
            query: {
                timezone: 'America/Los_Angeles',
                username: req.query.username,
                platform: req.query.platform,
                cutoff: "10"
            }
        }
    };
    let gamerQueryData = await queryGamers({username: username, platform: platform});
    let gamerData =gamerQueryData[0]
    if(gamerData){
        let promises = Object.keys(views).filter((v)=> defaultViews.includes(v) || queriedViews.includes(v)).map(async (key: string) => await queryView(key, views[key].query));
        Bluebird.all(promises).then(async (arrData) => {
            Object.keys(views).filter((v)=> defaultViews.includes(v) || queriedViews.includes(v)).forEach((key: string, index: number) => views[key].data = arrData[index]);
            let gamer = sanitizeGamer(views['player_stat_summary']['data'][0]) || {};
            let gamerPromise = Bluebird.resolve(gamerData);
            let viewData = views[view as string]['data'];
            if(view as string === 'teammate_analysis'){
                let newViewData = {};
                newViewData['teammates']= sanitizeTeammates(viewData);
                newViewData['titleKeys'] =  Object.keys(viewData[0]).filter((key) => !FILTER_KEYS.includes(key)).map(columnToDisplayName);
                viewData = newViewData;
            }
            if (!gamerData.needs_update) {
                gamerData.needs_update = true;
                gamerPromise = updateGamer({username: gamerData.username, platform: gamerData.platform}, gamerData);
            }
            await gamerPromise;
            let seoMetadata = {
                title: 'Warzone stats for ' + gamer.username,
                keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
                description: 'KDR: ' + gamer.kdr + ' Gulag Win Rate: ' + gamer.gulag_win_rate
            };

            res.json({
                gamer: gamer,
                viewData: viewData,
                seoMetadata: seoMetadata,
                filterKeys: FILTER_KEYS
            })
        })


    }
    else{
        res.json({
            message: username + ' on platform: ' + platform + ' was not found!'
        })
    }


}