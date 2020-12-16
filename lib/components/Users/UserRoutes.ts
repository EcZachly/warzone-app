import {NextApiRequest, NextApiResponse} from 'next';

import responseHandler from './../../../routes/responseHandler';

import {RawUser, User, RawUserList, UserList} from './UserTypes';
import UserController from './UserController';
import UserService from './UserService';
import TypeService from '../../../src/services/TypeService';
import UtilityService from '../../../src/services/UtilityService';

import {AuthService} from './../Auth';
import {DEFAULT_ERROR_MESSAGE, STATUS_CODE} from '../../../src/config/CONSTANTS';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export function createUser(req: NextApiRequest, res: NextApiResponse) {
    let {user} = req.body;

    if (TypeService.isObject(user) === false) {
        responseHandler.handleError(req, res, {message: 'body.user (Object) is required'}, 400);
    } else {
        let {email, first_name, password} = user;

        if (TypeService.isString(email, true) === false) {
            responseHandler.handleError(req, res, {message: 'body.user.email (String) is required'}, 400);
        } else if (UtilityService.isValidEmail(email) === false) {
            responseHandler.handleError(req, res, {message: 'body.user.email (String) is not a valid email'}, 400);
        } else if (TypeService.isString(first_name, true) === false) {
            responseHandler.handleError(req, res, {message: 'body.user.first_name (String) is required'}, 400);
        } else if (TypeService.isString(password, true) === false) {
            responseHandler.handleError(req, res, {message: 'body.user.password (String) is required'}, 400);
        } else {
            const validPasswordStatus = AuthService.validatePassword(password);

            if (validPasswordStatus !== true) {
                responseHandler.handleError(req, res, {userMessage: validPasswordStatus || 'Password is invalid, please try something else'}, 400);
            } else {
                AuthService.encryptPassword(password).then((encryptedPassword) => {
                    UserController.createUser({
                        email, first_name,
                        password: encryptedPassword
                    }).then((user) => {
                        responseHandler.handleResponse(req, res, {user: UserService.sanitizeUser(user)});
                    }).catch((error) => {
                        console.error(error);
                        responseHandler.handleError(req, res, {message: DEFAULT_ERROR_MESSAGE});
                    });
                }).catch((error) => {
                    console.error(error);
                    console.log(responseHandler.handleError(req, res, {message: DEFAULT_ERROR_MESSAGE}));
                });
            }
        }
    }
}



export function login(req: NextApiRequest, res: NextApiResponse) {
    let {email, password} = req.body;

    if (TypeService.isString(email, true) === false) {
        responseHandler.handleError(req, res, {message: 'body.email (String) is required'}, 400);
    } else if (TypeService.isString(password, true) === false) {
        responseHandler.handleError(req, res, {message: 'body.password (String) is required'}, 400);
    } else {
        UserController.queryUsers({email: email}, {}, {sanitize: false}).then((users) => {
            if (users && TypeService.isObject(users[0], true)) {
                let user = users[0];

                AuthService.comparePassword(password, user.password).then((passwordsMatch) => {
                    if (passwordsMatch) {
                        AuthService.setJWTTokenCookie({
                            user_id: user.user_id
                        }, res);

                        responseHandler.handleResponse(req, res, {user: UserService.sanitizeUser(user)});
                    } else {
                        responseHandler.handleError(req, res, {userMessage: 'Invalid email/password combination'}, 400);
                    }
                }).catch((error) => {
                    console.error(error);
                    responseHandler.handleError(req, res, {message: DEFAULT_ERROR_MESSAGE}, 500);
                });

            } else {
                responseHandler.handleError(req, res, {userMessage: 'Invalid email/password combination'}, 400);
            }
        }).catch((error) => {
            console.error(error);
            responseHandler.handleError(req, res, {message: DEFAULT_ERROR_MESSAGE}, 500);
        });
    }
}



export function verifyUserToken(req, res) {
    let {jwt} = req.cookies;
    let {user_id} = req.body;

    if (TypeService.isInteger(user_id)) {
        if (TypeService.isString(jwt)) {
            let decodedToken;

            try {
                decodedToken = AuthService.decodeJWTToken(jwt);
            } catch (error) {
                //invalid token
            }

            if (TypeService.isObject(decodedToken)) {
                AuthService.verifyJWTToken(decodedToken, {
                    user_id: user_id,
                    verifySession: true,
                    updateSession: true
                }).then((response) => {
                    AuthService.setJWTTokenCookie({
                        user_id: decodedToken.user_id
                    }, res);

                    responseHandler.handleResponse(req, res, {message: 'valid token'});
                }).catch((error) => {
                    console.error('verify jwt token failed');
                    let responseMessage = 'an unknown error occurred';

                    if (error && error.message) {
                        responseMessage = error.message;
                    }

                    console.error(error);
                    res.clearCookie('jwt');
                    responseHandler.handleError(req, res, responseMessage, STATUS_CODE.INTERNAL_ERROR);
                });
            } else {
                res.clearCookie('jwt');
                responseHandler.handleError(req, res, 'invalid token', STATUS_CODE.BAD_REQUEST);
            }
        } else {
            responseHandler.handleError(req, res, 'no token found in the cookie', STATUS_CODE.BAD_REQUEST);
        }
    } else {
        responseHandler.handleError(req, res, 'user_id (Integer) is required in the body', STATUS_CODE.BAD_REQUEST);
    }
}




export default {
    createUser,
    login,

};