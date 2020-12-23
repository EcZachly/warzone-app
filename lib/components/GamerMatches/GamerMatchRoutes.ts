import {NextApiRequest, NextApiResponse} from 'next';

import responseHandler from './../../../routes/responseHandler';

import {GamerMatchList, RawGamerMatchList} from './GamerMatchTypes';
import GamerMatchController from './GamerMatchController';
import TypeService from '../../../src/services/TypeService';
import {RouteService} from '../Routes';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export async function queryGamerMatches(req: NextApiRequest, res: NextApiResponse) {
    const query = RouteService.sanitizeQueryParameters(req.query);

    let options = {
        limit: undefined as number,
        offset: undefined as number,
        order: undefined as []
    };

    options.limit = query.limit || 10;
    delete query.limit;

    options.offset = query.offset || 0;
    delete query.offset;

    // @ts-ignore
    options.order = query.order;
    delete query.order;

    if (TypeService.isArray(options.order) === false) {
        delete options.order;
    }

    GamerMatchController.queryGamerMatches(query, options).then((gamerMatches) => {
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