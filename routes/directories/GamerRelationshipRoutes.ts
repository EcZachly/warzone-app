import {Request, Response} from 'express';

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



export async function queryGamerRelationships(req: Request, res: Response) {
    const queryParams = req.query;

    const options = {
        order: undefined
    };

    // @ts-ignore
    options.order = UtilityService.isJson(req.query.order) ? JSON.parse(req.query.order) : null;
    delete queryParams.order;

    if (TypeService.isArray(options.order) === false) {
        delete options.order;
    }

    try {
        const gamerRelationships = await GamerRelationshipController.queryGamerRelationships(queryParams, options);
        if (gamerRelationships.length > 0) {
            responseHandler.handleResponse(req, res, gamerRelationships);
        } else {
            responseHandler.handleError(req, res, '', 204);
        }
    } catch (e) {
        responseHandler.handleError(req, res, e, 500);
    }

}



export async function createGamerRelationship(req: Request, res: Response) {
    const gamerRelationship = req.body.gamerRelationship;
    const errorMap = {
        'missing_data': {
            message: `body.gamerRelationship.user_id (integer) is required,
                      body.gamerRelationship.username (string) is required, 
                      body.gamerRelationship.platform (string) is required, 
                      body.gamerRelationship.type (string) is required and must be one of the following: ${JSON.stringify(GamerRelationshipService.getValidTypes())}
                     `
        },
        'invalid_relationship_type': {message: `body.gamerRelationship.type (String) is required and must be one of the following: ${JSON.stringify(GamerRelationshipService.getValidTypes())}`}
    };

    const hasMissingData = !TypeService.isInteger(gamerRelationship.user_id) ||
        !TypeService.isString(gamerRelationship.username, true) ||
        !TypeService.isString(gamerRelationship.platform, true);

    const hasInvalidData = !GamerRelationshipService.isValidType(gamerRelationship.type);

    if (hasMissingData) {
        return responseHandler.handleError(req, res, errorMap['missing_data'], 400);
    }
    if (hasInvalidData) {
        return responseHandler.handleError(req, res, errorMap['invalid_relationship_type'], 400);
    }

    try {
        const newGamerRelationship = await GamerRelationshipController.createGamerRelationship(gamerRelationship);
        if (newGamerRelationship) {
            return responseHandler.handleResponse(req, res, newGamerRelationship);
        } else {
            return responseHandler.handleError(req, res, DEFAULT_ERROR_MESSAGE, 500);
        }
    } catch (e) {
        return responseHandler.handleError(req, res, e, 500);
    }
}



export async function removeGamerRelationship(req: Request, res: Response) {
    const gamerRelationship = req.body.gamerRelationship;

    const missingData = [
        !TypeService.isInteger(gamerRelationship.user_id) && 'body.gamerRelationship.user_id (integer) is required',
        !TypeService.isString(gamerRelationship.username, true) && 'body.gamerRelationship.username (string) is required and cannot be empty',
        !TypeService.isString(gamerRelationship.platform, true) && 'body.gamerRelationship.platform (string) is required and cannot be empty'
    ].filter((item) => !!item);

    if (missingData.length > 0) {
        return responseHandler.handleError(req, res, {message: missingData.join('. ')}, 400);
    }

    try {
        await GamerRelationshipController.removeGamerRelationship(gamerRelationship);
        responseHandler.handleResponse(req, res, {message: 'gamerRelationship successfully removed'});
    } catch (error) {
        return responseHandler.handleError(req, res, error, 500);
    }
}



export default {
    queryGamerRelationships,
    createGamerRelationship,
    removeGamerRelationship
};