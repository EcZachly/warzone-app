import express from 'express'
import {initializeGamer, queryGamers} from "../lib/model/gamers";
import {queryView} from "../lib/model/analysis";
import {handleResponse} from './response_handler';
import {initializeMatches} from "../lib/model/matches";
import recaptcha from "../lib/middleware/recaptcha";


let api_router = express.Router();

api_router.use((req, res, next) => {
    req.analysisStartTime = new Date();
    next();
});


api_router.post('/gamer', recaptcha.middleware.verify, async (req, res) => {
    if(!req.recaptcha.error){
        let gamer = {
            username: req.body.username,
            platform: req.body.platform
        };
        let gamers = await queryGamers(gamer);
        if(gamers.length){
            let errorMessage = gamer.username + ' already exists!'
            res.redirect('/gamers?submissionError=' + errorMessage);
        }
        else{
            try {
                let initializedGamer = await initializeGamer(gamer);
                let matches = await initializeMatches(initializedGamer);
                return res.redirect('/gamer/' +  gamer.platform + '/' + encodeURIComponent(gamer.username));
            }
            catch(e){
                let errorMessage = gamer.username + '  was not found. Maybe you made a typo??'
                return res.redirect('/gamers?submissionError=' + errorMessage);
            }
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