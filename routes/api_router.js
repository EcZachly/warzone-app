import express from 'express'
import {initializeGamer, queryGamers} from "../lib/model/gamers";
import {queryView} from "../lib/model/analysis";
import {handleResponse} from './response_handler';
import {initializeMatches} from "../lib/model/matches";

let api_router = express.Router();

api_router.use((req, res, next) => {
    req.analysisStartTime = new Date();
    next();
});


api_router.post('/gamer', async (req, res) => {
    let gamers = await queryGamers(req.body);
    if(gamers.length){
        let errorMessage = req.body.username + ' already exists!'
        res.redirect('/gamers?submissionError=' + errorMessage);
    }
    else{
        try {
            let initializedGamer = await initializeGamer(req.body);
            let matches = await initializeMatches(initializedGamer);
            return res.redirect('/gamer/' +  req.body.platform + '/' + encodeURIComponent(req.body.username));
        }
        catch(e){
            let errorMessage = req.body.username + '  was not found. Maybe you made a typo??'
            return res.redirect('/gamers?submissionError=' + errorMessage);
        }
    }
});


api_router.get('/data/:view', async (req, res) => {
    let viewName = req.params.view;
    let query = req.query;
    try {
        let data = await queryView(viewName, query);
        handleResponse(req, res, data);
    }
    catch(e){
        handleResponse(req, res, e);
    }
})

export default api_router;