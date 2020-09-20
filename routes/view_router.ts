import * as express from 'express';
import {ApiRequest, ApiResponse} from "../lib/middleware/request_object"
import {handleRender} from './response_handler';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';

import recaptcha from "../lib/middleware/recaptcha";
import {queryView} from '../lib/model/analysis';
import {updateGamer} from '../lib/model/gamers';

let view_router = express.Router();
let FILTER_KEYS = ['shooting_player', 'shooting_player_platform', 'helping_player_temp', 'helping_player_platform', 'shooting_player_temp'];

import UtilityService from './../lib/services/UtilityService.js';

//===---==--=-=--==---===----===---==--=-=--==---===----//
view_router.use((req: ApiRequest, res: ApiResponse, next) => {
    req.startTime = new Date().getTime();
    next();
});


view_router.get('/gamer/:platform/:username', async (req: ApiRequest, res: ApiResponse) => {
    let views = {
        'player_stat_summary': {
            query: {
                username: req.params.username,
                platform: req.params.platform
            }
        },
        'teammate_analysis': {
            query: {
                shooting_player: req.params.username,
                shooting_player_platform: req.params.platform
            }
        },
        'gamer_stats_graded': {
            query: {
                username: req.params.username,
                platform: req.params.platform
            }
        },
        'gamers': {
            query: {
                username: req.params.username,
                platform: req.params.platform
            }
        }
    };

    let promises = Object.keys(views).map(async (key: string) => await queryView(key, views[key].query));

    Bluebird.all(promises).then(async (arrData) => {
        Object.keys(views).forEach((key: string, index: number) => views[key].data = arrData[index]);

        let gamer = sanitizeGamer(views['player_stat_summary']['data'][0]);
        let teammates = sanitizeTeammates(views['teammate_analysis']['data']);
        let grades = views['gamer_stats_graded']['data'][0];

        let gamerData = views['gamers']['data'][0];
        let gamerPromise = Bluebird.resolve(gamerData);

        if (!gamerData.needs_update) {
            gamerData.needs_update = true;
            gamerPromise = updateGamer({username: gamerData.username, platform: gamerData.platform}, gamerData);
        }

        await gamerPromise;

        let titleKeys = Object.keys(teammates[0]).filter((key) => !FILTER_KEYS.includes(key)).map(columnToDisplayName);

        let seoMetadata = {
            title: 'Warzone stats for ' + gamer.username,
            keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
            description: 'KDR: ' + gamer.kdr + ' Gulag Win Rate: ' + gamer.gulag_win_rate
        };

        handleRender(req, res, 'gamer/detail', {
            gamer: gamer,
            grades: grades,
            titleKeys: titleKeys,
            teammateData: teammates,
            seoMetadata: seoMetadata,
            filterKeys: FILTER_KEYS
        })
    });
});

view_router.get('/gamers', recaptcha.middleware.render, async (req: ApiRequest, res: ApiResponse) => {
    let viewName: string = 'player_stat_summary';
    let queryParams = req.query;

    let submittedUsername: string = (queryParams.submittedUsername || "").toString();
    let submissionError: string = (queryParams.submissionError || "").toString();

    let rawGamerList = await queryView(viewName);
    let sanitizedGamers = rawGamerList.map(sanitizeGamer);
    let seoMetadata = {
        title: 'Warzone Gamers',
        keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
        description: 'Warzone stats for ' + sanitizedGamers.length + ' gamers'
    };
    res.render('gamer/list', {
        captcha: res.recaptcha,
        gamers: sanitizedGamers,
        seoMetadata: seoMetadata,
        submittedUsername: submittedUsername,
        submissionError: submissionError,
        filterKeys: FILTER_KEYS
    });
});


//===---==--=-=--==---===----===---==--=-=--==---===----//
//PRIVATE METHODS


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


export default view_router;

