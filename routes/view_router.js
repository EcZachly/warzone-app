import express from 'express'
import {queryView} from "../lib/model/analysis";

let view_router = express.Router();

view_router.get('/gamer/:username', (req, res) => {
    let viewName = 'player_stat_summary';
    let query = {username: req.params.username};

    queryView(viewName, query).then((data) => {
        let gamer = data[0];
        let seoMetadata = {
            title: 'Warzone stats for ' + data[0].username,
            keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
            description: 'KDR: ' + gamer.kdr.toFixed(2) + ' Gulag Win Rate: ' + gamer.gulag_win_rate.toFixed(2) * 100 + '%'
        };
        res.render('gamer/detail', {gamer: data[0], seoMetadata: seoMetadata})
    });
});

view_router.get('/gamers', (req, res) => {
    let viewName = 'player_stat_summary';
    let submittedUsername = req.query.submittedUsername || '';
    let submissionError = req.query.submissionError || '';
    let query = {};
    queryView(viewName, query).then((data) => {

        let seoMetadata = {
            title: 'Warzone Gamers',
            keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
            description: 'Warzone stats for ' + data.length + ' gamers'
        };
        res.render('gamer/list', {
            gamers: data,
            seoMetadata: seoMetadata,
            submittedUsername: submittedUsername,
            submissionError: submissionError
        })
    });
});


export default view_router;

