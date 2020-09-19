import express from 'express';
import {queryView} from '../lib/model/analysis';
import {updateGamer} from '../lib/model/gamers';
import Bluebird from 'bluebird';
import _ from 'lodash';
import recaptcha from "../lib/middleware/recaptcha";

let view_router = express.Router();
let FILTER_KEYS = ['shooting_player', 'shooting_player_platform', 'helping_player_temp', 'helping_player_platform', 'shooting_player_temp'];


function columnToDisplayName(column) {
    return column.split('_').map(_.capitalize).join(' ');
}

function mapGamer(gamer) {
    let gulagWinRate = (gamer.gulag_win_rate.toFixed(4) * 100).toFixed(2) + '%';
    let kdr = gamer.kdr.toFixed(4);
    gamer.gulag_win_rate = gulagWinRate;
    gamer.kdr = kdr.toString();
    return gamer;
}

view_router.get('/gamer/:platform/:username', async (req, res) => {
    let views = {
        'player_stat_summary': {query: {username: req.params.username}},
        'teammate_analysis': {
            query: {
                shooting_player: req.params.username,
                shooting_player_platform: req.params.platform
            }
        },
        'gamer_stats_graded': {query: {username: req.params.username, platform: req.params.platform}},
        'gamers': {query: {username: req.params.username, platform: req.params.platform}}
    };
    let promises = Object.keys(views).map((key) => queryView(key, views[key].query));
    return Bluebird.all(promises).then(async (arrData) => {
        Object.keys(views).forEach((key, index) => views[key].data = arrData[index]);

        let gamer = mapGamer(views['player_stat_summary'].data[0]);
        let teammateData = views['teammate_analysis'].data.map(mapGamer).map((gamer) => {
            gamer.helping_player = {
                name: gamer.helping_player,
                platform: gamer.helping_player_platform
            }
            return gamer;
        });
        let grades = views['gamer_stats_graded'].data[0];
        let gamerData = views['gamers'].data[0];
        let gamerPromise = Bluebird.resolve(gamerData);

        if (!gamerData.needs_update) {
            gamerData.needs_update = true;
            gamerPromise = updateGamer({username: gamerData.username, platform: gamerData.platform}, gamerData);
        }

        await gamerPromise;

        let titleKeys = Object.keys(teammateData[0]).filter((key) => !FILTER_KEYS.includes(key)).map(columnToDisplayName);
        let seoMetadata = {
            title: 'Warzone stats for ' + gamer.username,
            keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
            description: 'KDR: ' + gamer.kdr + ' Gulag Win Rate: ' + gamer.gulag_win_rate
        };
        res.render('gamer/detail', {
            gamer: gamer,
            grades: grades,
            titleKeys: titleKeys,
            teammateData: teammateData,
            seoMetadata: seoMetadata,
            filterKeys: FILTER_KEYS
        });
    });
});

view_router.get('/gamers', recaptcha.middleware.render, async (req, res) => {
    let viewName = 'player_stat_summary';
    let queryParams = req.query;

    let submittedUsername = queryParams.submittedUsername || '';
    let submissionError = queryParams.submissionError || '';

    let data = await queryView(viewName);
    let mappedGamers = data.map(mapGamer);
    let seoMetadata = {
        title: 'Warzone Gamers',
        keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
        description: 'Warzone stats for ' + data.length + ' gamers'
    };
    res.render('gamer/list', {
        captcha: res.recaptcha,
        captcha_site_key: process.env.WARZONE_RECAPTCHA_SITE_KEY,
        gamers: mappedGamers,
        seoMetadata: seoMetadata,
        submittedUsername: submittedUsername,
        submissionError: submissionError,
        filterKeys: FILTER_KEYS
    });
});


export default view_router;

