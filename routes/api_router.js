import express from 'express'
import {queryGamers} from "../lib/model/gamer";
import {queryView} from "../lib/model/analysis";
import {handleResponse} from './response_handler';
let api_router = express.Router();

api_router.use((req, res, next)=>{
    req.analysisStartTime = new Date();
    next();
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