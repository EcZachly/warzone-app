import {NextApiRequest, NextApiResponse} from 'next';

import responseHandler from './../../../routes/responseHandler';

import {
    RawGamerRelationship,
    RawGamerRelationshipList,
    GamerRelationship,
    GamerRelationshipList
} from './GamerRelationshipTypes';
import GamerRelationshipController from './GamerRelationshipController';
import GamerRelationshipService from './GamerRelationshipService';

import TypeService from '../../../src/services/TypeService';
import UtilityService from '../../../src/services/UtilityService';

import {DEFAULT_ERROR_MESSAGE, STATUS_CODE} from '../../../src/config/CONSTANTS';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export async function queryGamerRelationships(req: NextApiRequest, res: NextApiResponse) {
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
    options.order = UtilityService.isJson(req.query.order) ? JSON.parse(req.query.order) : null;
    delete queryParams.order;

    if (TypeService.isArray(options.order) === false) {
        delete options.order;
    }

    GamerRelationshipController.queryGamerRelationships(queryParams, options).then((gamerRelationships) => {
        if (gamerRelationships.length > 0) {
            responseHandler.handleResponse(req, res, gamerRelationships);
        } else {
            responseHandler.handleError(req, res, '', 204);
        }
    }).catch((error) => {
        console.log('error', error);

        responseHandler.handleError(req, res, error, 500);
    });
}



export default {
    queryGamerRelationships
};