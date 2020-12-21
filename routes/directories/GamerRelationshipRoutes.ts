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



export async function createGamerRelationship(req: NextApiRequest, res: NextApiResponse) {
    const gamerRelationship = req.body.gamerRelationship;

    if (TypeService.isInteger(gamerRelationship.user_id) === false) {
        responseHandler.handleError(req, res, {message: 'body.gamerRelationship.user_id (Integer) is required'}, 400);
    } else if (TypeService.isString(gamerRelationship.username, true) === false) {
        responseHandler.handleError(req, res, {message: 'body.gamerRelationship.username (String) is required'}, 400);
    } else if (TypeService.isString(gamerRelationship.platform, true) === false) {
        responseHandler.handleError(req, res, {message: 'body.gamerRelationship.platform (String) is required'}, 400);
    } else if (GamerRelationshipService.isValidType(gamerRelationship.type) === false) {
        responseHandler.handleError(req, res, {message: 'body.gamerRelationship.type (String) is required and must be one of the following: ' + JSON.stringify(GamerRelationshipService.getValidTypes())}, 400);
    } else {
        GamerRelationshipController.createGamerRelationship(gamerRelationship).then((newGamerRelationship) => {
            if (newGamerRelationship) {
                responseHandler.handleResponse(req, res, newGamerRelationship);
            } else {
                responseHandler.handleError(req, res, DEFAULT_ERROR_MESSAGE, 500);
            }
        }).catch((error) => {
            console.log('error', error);
            responseHandler.handleError(req, res, error, 500);
        });
    }
}



export default {
    queryGamerRelationships,
    createGamerRelationship
};