import express from 'express'
import {queryView} from "../lib/model/analysis";
import Bluebird from 'bluebird';

let view_router = express.Router();

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

    let promises = Object.keys(views).map((key)=> queryView(key, views[key].query));

    return Bluebird.all(promises).then((arrData)=>{
         Object.keys(views).forEach((key, index)=> {
            views[key].data = arrData[index];
        });
        let gamer = mapGamer(views['player_stat_summary'].data[0]);
        let teammateData = views['teammate_analysis'].data;
        let seoMetadata = {
            title: 'Warzone stats for ' + gamer.username,
            keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
            description: 'KDR: ' + gamer.kdr + ' Gulag Win Rate: ' + gamer.gulag_win_rate + '%'
        };
        res.render('gamer/detail', {gamer: gamer, teammateData: teammateData, seoMetadata: seoMetadata});
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
            submissionError: submissionError
        })
    });
});


export default view_router;

