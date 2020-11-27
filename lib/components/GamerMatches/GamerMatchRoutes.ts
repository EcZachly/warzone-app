import {NextApiRequest, NextApiResponse} from 'next';

import responseHandler from './../../../routes/responseHandler';

import {GamerMatchList, RawGamerMatchList} from './GamerMatchTypes';
import GamerMatchController from './GamerMatchController';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export async function queryGamerMatches(req: NextApiRequest, res: NextApiResponse) {
    const queryParams = req.query;

    const limit = req.query.limit || 10;
    delete queryParams.limit;

    const offset = req.query.offset || 0;
    delete queryParams.offset;

    console.log(queryParams);

    GamerMatchController.queryGamerMatches(queryParams, {limit, offset}).then((gamerMatches) => {
        console.log('gamerMatches', gamerMatches)

        if (gamerMatches.length > 0) {
            responseHandler.handleResponse(req, res, gamerMatches);
        } else {
            responseHandler.handleError(req, res, '', 204);
        }
    }).catch((error) => {
        console.log('error', error);

        responseHandler.handleError(req, res, error, 500);
    });
}


export default {
    queryGamerMatches
};