import {Request, Response} from 'express';

import responseHandler from './../../../routes/responseHandler';

import {MatchList, RawMatchList} from './MatchTypes';
import MatchController from './MatchController';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export async function queryMatches(req: Request, res: Response) {
    const queryParams = req.query;

    const limit = req.query.limit || 10;
    delete queryParams.limit;

    const offset = req.query.offset || 0;
    delete queryParams.offset;

    MatchController.queryMatches(queryParams, {limit, offset}).then((matches) => {
        if (matches.length > 0) {
            responseHandler.handleResponse(req, res, matches);
        } else {
            responseHandler.handleError(req, res, '', 204);
        }
    }).catch((error) => {
        responseHandler.handleError(req, res, error, 500);
    });
}


export default {
    queryMatches
};