import * as express from 'express'
import { ApiRequest, ApiResponse } from "../lib/middleware/request_object"
import {initializeGamer, queryGamers} from "../lib/model/gamers";
import {queryView} from "../lib/model/analysis";
import {handleResponse, handleRedirect} from './response_handler';
import {initializeMatches} from "../lib/model/matches";
import recaptcha from "../lib/middleware/recaptcha";


let api_router = express.Router();

api_router.use((req: ApiRequest, res: ApiResponse, next) => {
    req.startTime = new Date().getTime();
    next();
});


api_router.post('/gamer', recaptcha.middleware.verify, async (req: ApiRequest, res: ApiResponse) => {
    if(!req.recaptcha.error || req.hostname === 'localhost'){
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
                return handleRedirect(req, res, '/gamer/' +  gamer.platform + '/' + encodeURIComponent(gamer.username));
            }
            catch(e){
                let errorMessage = gamer.username + '  was not found. Maybe you made a typo??'
                return handleRedirect(req, res, '/gamers?submissionError=' + errorMessage);
            }
        }
    }
});


api_router.get('/data/:view', async (req: ApiRequest, res: ApiResponse) => {
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