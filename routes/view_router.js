import express from 'express'
import {queryGamers} from "../lib/model/gamer";
import {queryView} from "../lib/model/analysis";
import {handleResponse} from './response_handler';
let view_router = express.Router();


view_router.get('/gamer/:username', (req, res)=>{
    let viewName = 'player_stat_summary';
    let query = {username: req.params.username};
    queryView(viewName, query).then((data)=>{
        res.render('gamer/detail', {gamer: data[0] })
    });
});


view_router.get('/gamers', (req, res)=>{
    let viewName = 'player_stat_summary';
    let query = {};
    queryView(viewName, query).then((data)=>{
        res.render('gamer/detail', {gamers: data })
    });
});



export default view_router;

