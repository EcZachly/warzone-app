import {NextApiRequest, NextApiResponse} from 'next';

import responseHandler from './../../../routes/responseHandler';

import {RawUser, User, RawUserList, UserList} from './UserTypes';
import UserController from './UserController';
import UserService from './UserService';
import TypeService from '../../../src/services/TypeService';
import UtilityService from '../../../src/services/UtilityService';

import {AuthService} from './../Auth';
import {DEFAULT_ERROR_MESSAGE} from '../../../src/config/CONSTANTS';



//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export function createUser(req: NextApiRequest, res: NextApiResponse) {
    let {email, first_name, password} = req.body;

    if (TypeService.isString(email, true) === false) {
        responseHandler.handleError(req, res, {message: 'body.email (String) is required'}, 400);
    } else if (UtilityService.isValidEmail(email) === false) {
        responseHandler.handleError(req, res, {message: 'body.email (String) is not a valid email'}, 400);
    } else if (TypeService.isString(first_name, true) === false) {
        responseHandler.handleError(req, res, {message: 'body.first_name (String) is required'}, 400);
    } else if (TypeService.isString(password, true) === false) {
        responseHandler.handleError(req, res, {message: 'body.password (String) is required'}, 400);
    } else {
        const validPasswordStatus = AuthService.validatePassword(password);

        if (validPasswordStatus !== true) {
            responseHandler.handleError(req, res, {userMessage: validPasswordStatus || 'Password is invalid, please try something else'}, 400);
        } else {
            AuthService.encryptPassword(password).then((encryptedPassword) => {
                UserController.createUser({
                    email, first_name, password: encryptedPassword
                }).then((user) => {
                    responseHandler.handleResponse(req, res, {user: UserService.sanitizeUser(user)});
                }).catch((error) => {
                    console.log(error);
                    responseHandler.handleError(req, res, {message: DEFAULT_ERROR_MESSAGE});
                });
            }).catch(reject);
        }
    }
}



export default {
    createUser
};