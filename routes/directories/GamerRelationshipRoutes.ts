import {NextApiRequest, NextApiResponse} from 'next';

import responseHandler from '../responseHandler';

import {
    RawGamerRelationship,
    RawGamerRelationshipList,
    GamerRelationship,
    GamerRelationshipList
} from '../../lib/components/GamerRelationships/GamerRelationshipTypes';
import GamerRelationshipController from '../../lib/components/GamerRelationships/GamerRelationshipController';
import GamerRelationshipService from '../../lib/components/GamerRelationships/GamerRelationshipService';

import TypeService from '../../src/services/TypeService';
import UtilityService from '../../src/services/UtilityService';

import {DEFAULT_ERROR_MESSAGE, STATUS_CODE} from '../../src/config/CONSTANTS';
import {RawGamer} from '../../src/components/gamer/GamerTypes';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export async function queryGamerRelationships(req: NextApiRequest, res: NextApiResponse) {
    const queryParams = req.query;

    let options = {
        order: undefined
    };

    // @ts-ignore
    options.order = UtilityService.isJson(req.query.order) ? JSON.parse(req.query.order) : null;
    delete queryParams.order;

    if (TypeService.isArray(options.order) === false) {
        delete options.order;
    }

    try {
        let gamerRelationships = await GamerRelationshipController.queryGamerRelationships(queryParams, options)
        if (gamerRelationships.length > 0) {
            responseHandler.handleResponse(req, res, gamerRelationships);
        } else {
            responseHandler.handleError(req, res, '', 204);
        }
    }
    catch(e){
        responseHandler.handleError(req, res, e, 500);
    }

}


export async function createGamerRelationship(req: NextApiRequest, res: NextApiResponse) {
    const gamerRelationship = req.body.gamerRelationship;
    let errorMap = {
        'missing_data': {
            message: `body.gamerRelationship.user_id (Integer) is required,
                      body.gamerRelationship.username (String) is required, 
                      body.gamerRelationship.platform (String) is required, 
                      body.gamerRelationship.type (String) is required and must be one of the following: ${JSON.stringify(GamerRelationshipService.getValidTypes())}
                     `
        },
        'invalid_relationship_type': {message: `body.gamerRelationship.type (String) is required and must be one of the following: ${JSON.stringify(GamerRelationshipService.getValidTypes())}`}
    }

    const hasMissingData = !TypeService.isInteger(gamerRelationship.user_id) ||
        !TypeService.isString(gamerRelationship.username, true) ||
        !TypeService.isString(gamerRelationship.platform, true)

    const hasInvalidData = !GamerRelationshipService.isValidType(gamerRelationship.type)

    if (hasMissingData) {
        return responseHandler.handleError(req, res, errorMap['missing_data'], 400);
    }
    if (hasInvalidData) {
        return responseHandler.handleError(req, res, errorMap['invalid_relationship_type'], 400);
    }

    try {
        let newGamerRelationship = await GamerRelationshipController.createGamerRelationship(gamerRelationship);
        if (newGamerRelationship) {
            return responseHandler.handleResponse(req, res, newGamerRelationship);
        } else {
            return responseHandler.handleError(req, res, DEFAULT_ERROR_MESSAGE, 500);
        }
    } catch (e) {
        return responseHandler.handleError(req, res, e, 500);
    }
}


export default {
    queryGamerRelationships,
    createGamerRelationship
};