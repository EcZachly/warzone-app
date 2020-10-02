import * as express from 'express'
import {ApiRequest, ApiResponse, ApiRequestHandler} from "../lib/middleware/request_object"
import {queryView} from "../lib/model/analysis";
import {handleResponse, handleRedirect} from './response_handler';
import {initializeMatches} from "../lib/model/matches";
import recaptcha from "../lib/middleware/recaptcha";

let api_router = express.Router();

import GamerRoutes from './../lib/components/Gamers/GamerRoutes';

//===---==--=-=--==---===----===---==--=-=--==---===----//


api_router.use((req: ApiRequest, res: ApiResponse, next) => {
    req.startTime = new Date().getTime();
    next();
});


api_router.post('/api/gamer', recaptcha.middleware.verify, GamerRoutes.createGamer);


api_router.get('/data/:view', async (req: ApiRequest, res: ApiResponse) => {
    let viewName = req.params.view;
    let query = req.query;
    try {
        let data = await queryView(viewName, query);
        handleResponse(req, res, data);
    } catch (e) {
        handleResponse(req, res, e);
    }
});

export default api_router;