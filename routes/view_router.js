import express from 'express'
import {queryView} from "../lib/model/analysis";
import Bluebird from 'bluebird';
import _ from 'lodash';

let view_router = express.Router();
let FILTER_KEYS = ['shooting_player', 'helping_player_temp', 'shooting_player_temp']


function columnToDisplayName(column){
    return column.split('_').map(_.capitalize).join(' ')
}

function mapGamer(gamer) {
    let gulagWinRate = (gamer.gulag_win_rate.toFixed(4) * 100).toFixed(2) + "%";
    let kdr = gamer.kdr.toFixed(4);
    gamer.gulag_win_rate = gulagWinRate;
    gamer.kdr = kdr.toString();
    return gamer;
}

view_router.get('/gamer/:username', (req, res) => {
    let views = {
        'player_stat_summary':  {query:{username: req.params.username}},
        'teammate_analysis': {query:{shooting_player: req.params.username}}
    };
    console.log(views);

    let promises = Object.keys(views).map((key)=> queryView(key, views[key].query));

    return Bluebird.all(promises).then((arrData)=>{
         Object.keys(views).forEach((key, index)=> {
            views[key].data = arrData[index];
        });
        let gamer = mapGamer(views['player_stat_summary'].data[0]);
        let teammateData = views['teammate_analysis'].data.map(mapGamer);
        console.log(gamer, teammateData);
        let titleKeys = Object.keys(teammateData[0]).filter((key)=> !FILTER_KEYS.includes(key)).map(columnToDisplayName);

        let seoMetadata = {
            title: 'Warzone stats for ' + gamer.username,
            keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
            description: 'KDR: ' + gamer.kdr + ' Gulag Win Rate: ' + gamer.gulag_win_rate + '%'
        };
        res.render('gamer/detail', {gamer: gamer, titleKeys: titleKeys, teammateData: teammateData, seoMetadata: seoMetadata, filterKeys: FILTER_KEYS});
    });
});

view_router.get('/gamers', (req, res) => {
    let viewName = 'player_stat_summary';
    let submittedUsername = req.query.submittedUsername || '';
    let submissionError = req.query.submissionError || '';
    let query = {};
    queryView(viewName, query).then((data) => {
        let mappedGamers = data.map(mapGamer)
        let seoMetadata = {
            title: 'Warzone Gamers',
            keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
            description: 'Warzone stats for ' + data.length + ' gamers'
        };
        res.render('gamer/list', {
            gamers: mappedGamers,
            seoMetadata: seoMetadata,
            submittedUsername: submittedUsername,
            submissionError: submissionError,
            filterKeys: FILTER_KEYS
        })
    });
});


export default view_router;

