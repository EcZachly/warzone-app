import express from 'express'
import {queryGamers, getGamerFromAPI} from "../lib/model/gamer";
import {queryView} from "../lib/model/analysis";
import {handleResponse} from './response_handler';
import {insertIntoDatabase} from "../lib/etl/utils";

import WarzoneMapper from "../lib/etl/mapper";
import {GAMER_TABLE} from "../lib/constants";
let api_router = express.Router();

api_router.use((req, res, next)=>{
    req.analysisStartTime = new Date();
    next();
});

api_router.post('/gamer', (req, res)=>{
    getGamerFromAPI(req.body.username, req.body.platform).then((gamer)=>{
        return insertIntoDatabase(WarzoneMapper.mapGamer(gamer), GAMER_TABLE).then((data)=>{
            res.redirect('/gamers?submittedUsername=' + req.body.username);
        }, (err)=>{
            res.redirect('/gamers?submittedUsername=' + req.body.username);
        });
    }, (err)=>{
        let errorMessage = req.body.username + '  was not found. Maybe you made a typo??'
        res.redirect('/gamers?submissionError=' + errorMessage);
    });
});


api_router.get('/gamers', (req, res)=>{
    queryGamers(req.query).then((gamers)=>{
        handleResponse(req, res, gamers);
    })
})

api_router.get('/data/:view', (req, res)=>{
    let viewName = req.params.view;
    let query = req.query;
    queryView(viewName, query).then((data)=>{
        handleResponse(req, res, data);
    }, (failure)=>{
        handleResponse(req, res, failure);
    })
})

export default api_router;