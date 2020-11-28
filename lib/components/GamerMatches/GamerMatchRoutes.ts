import {NextApiRequest, NextApiResponse} from 'next';

import responseHandler from './../../../routes/responseHandler';

import {GamerMatchList, RawGamerMatchList} from './GamerMatchTypes';
import GamerMatchController from './GamerMatchController';
import TypeService from '../../../src/services/TypeService';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export async function queryGamerMatches(req: NextApiRequest, res: NextApiResponse) {
    const queryParams = req.query;
    let options = {
        limit: undefined,
        offset: undefined,
        order: undefined
    };

    options.limit = req.query.limit || 10;
    delete queryParams.limit;

    options.offset = req.query.offset || 0;
    delete queryParams.offset;

    // @ts-ignore
    options.order = JSON.parse(req.query.order);
    delete queryParams.order;

    if (TypeService.isArray(options.order) === false) {
        delete options.order;
    }

    GamerMatchController.queryGamerMatches(queryParams, options).then((gamerMatches) => {
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