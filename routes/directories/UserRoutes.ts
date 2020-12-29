import {NextApiRequest, NextApiResponse} from 'next';

import responseHandler from '../responseHandler';

import UserController from '../../lib/components/Users/UserController';
import UserService from '../../lib/components/Users/UserService';
import TypeService from '../../src/services/TypeService';
import EmailService from "../../lib/components/Email/EmailService";
import UtilityService from '../../src/services/UtilityService';
import randomstring from 'randomstring';
import {AuthService} from '../../lib/components/Auth';
import {DEFAULT_ERROR_MESSAGE, STATUS_CODE} from '../../src/config/CONSTANTS';
import {update} from "../../lib/components/Database/DAO";


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//
export async function queryUsers(req: NextApiRequest, res: NextApiResponse){
    let query = {...req.query as object}
    let users = await UserController.queryUsers(query);
    return responseHandler.handleResponse(req, res, users);
}


export async function finishForgotPassword(req: NextApiRequest, res: NextApiResponse){
    let {forgot_string, password, email} = req.body.user;
    let encryptedPassword = await AuthService.encryptPassword(password);
    let updatedUser = await UserController.updateUser({forgot_string, email}, {password: encryptedPassword, forgot_string: undefined});
    return responseHandler.handleResponse(req, res, updatedUser);
}

export async function finishConfirmAccount(req: NextApiRequest, res: NextApiResponse){
    let {confirm_string} = req.query
    let updatedUser = await UserController.updateUser({confirm_string}, {confirm_string: null});
    let status =  !!updatedUser ? "success": "failure";
    return res.redirect('/user/confirm?status=' + status);
}

export async function createUser(req: NextApiRequest, res: NextApiResponse) {

    let errorMap = {
        'missing_data': {message: 'body.user (Object), body.user.email (String), body.user.first_name (String), and body.user.password are required'},
        'invalid_email': {message: 'body.user.email (String) is not a valid email'},
        'invalid_password': {message: 'Password is invalid, please try something else'}
    };
    let {user} = req.body;
    let noUserObject = !TypeService.isObject(user);
    if (noUserObject) {
       return responseHandler.handleError(req, res, errorMap['missing_data'], 400);
    }

    let {email, first_name, password} = user;
    let hasMissingData = !TypeService.isString(email, true) ||
        !TypeService.isString(first_name, true) ||
        !TypeService.isString(password, true);

    let invalidEmail = !UtilityService.isValidEmail(email);

    if (hasMissingData) {
        return responseHandler.handleError(req, res, errorMap['missing_data'], 400);
    }
    if (invalidEmail) {
        return responseHandler.handleError(req, res, errorMap['invalid_email'], 400);
    }

    const validPasswordStatus = AuthService.validatePassword(password);

    if (!validPasswordStatus) {
        return responseHandler.handleError(req, res, errorMap['invalid_password'], 400);
    }

    try {
        let encryptedPassword = await AuthService.encryptPassword(password);
        email = UserService.sanitizeEmailForStorage(email);
        first_name = first_name.trim();
        let createdUser = await UserController.createUser({
            email, first_name,
            password: encryptedPassword
        });
        let emailSent = await EmailService.sendEmail('confirm_account', user);
        return responseHandler.handleResponse(req, res, {user: UserService.sanitizeUser(createdUser), emailSent: emailSent});
    } catch (e) {
        return responseHandler.handleError(req, res, {message: DEFAULT_ERROR_MESSAGE});
    }

}

export async function sendForgotPassword(req: NextApiRequest, res: NextApiResponse){
    let {email} = req.body;
    let users = await UserController.queryUsers({email: UserService.sanitizeEmailForStorage(email)});
    if(users.length){
        let user = users[0];
        user.forgot_string = randomstring.generate(7);
        await UserController.updateUser({email: user.email}, user)
        await EmailService.sendEmail('forgot_password', user)
        return responseHandler.handleResponse(req, res,  {emailSent:true})
    }
    else{
        return responseHandler.handleError(req, res, {message: "invalid email"});
    }
}

export async function login(req: NextApiRequest, res: NextApiResponse) {
    let errorMap = {
        'missing_data': {message: 'body.email (String) and body.password (String) are required'},
        'invalid_combination': {message: 'Invalid email/password combination'}
    }
    let {email, password} = req.body;

    let hasMissingData = !TypeService.isString(email, true) || !TypeService.isString(password, true);

    if (hasMissingData) {
        return responseHandler.handleError(req, res, errorMap['missing_data'], 400);
    }
    try {
        let users = await UserController.queryUsers({email: UserService.sanitizeEmailForStorage(email)}, {}, {sanitize: false});
        let userIsOkay = users && TypeService.isObject(users[0], true)
        if (!userIsOkay) {
            return responseHandler.handleError(req, res, errorMap['invalid_combination'], 400);
        }
        let user = users[0];
        let passwordsMatch = await AuthService.comparePassword(password, user.password);
        if(!passwordsMatch){
            return responseHandler.handleError(req, res, errorMap['invalid_combination'], 400);
        }
        AuthService.setJWTTokenCookie({
            user_id: user.user_id
        }, res);
        return responseHandler.handleResponse(req, res, {user: UserService.sanitizeUser(user)});
    } catch (e) {
        console.error(e);
        responseHandler.handleError(req, res, {message: DEFAULT_ERROR_MESSAGE}, 500);
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
    finishForgotPassword,
    finishConfirmAccount,
    sendForgotPassword,
    login,
    verifyUserToken
};