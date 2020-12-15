import tracer from 'tracer';
const logger = tracer.colorConsole();

const express = require('express');
const path = require('path');
const useragent = require('express-useragent');
const requestIp = require('request-ip');
const jwt = require('jsonwebtoken');

import CONSTANTS from './../CONSTANTS';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

/**
 *
 * @param server
 * @param {Object} [options]
 */
export function configure(server, options) {
    server.use(useragent.express());
    server.use(requestIp.mw());
    server.all('/api/v*/*', validateSecureRequest);
}



function validateSecureRequest(req, res, next) {
    //we could also create a blacklist of invalidated tokens that would prevent someone from using an old token



    //ensure that it is a secure endpoint
    //if it's not secure, then next()

    //if it is secure, then look for token, if no token, then log out the user (delete token, send to login page with error message)
    //if the token doesn't decode, then log out the user (delete token, send to login page with error message)

    //IF TOKEN IS DECODED
    //check for expiration
    //every x attempts, we should verify the token with a call to the db
    //if the call to the db is successful and the token is valid, we should (every 1/x attempts) update the session expiration and update the user's token

    //if the user goes to the login page and has a localStorage value for user, we could submit a check to the database to ensure that our token is still valid and request a new token (and update the expiration in the session obj) and then redirect, otherwise we'll delete the token and delete the localStorage value too

    //if token is valid, next()

    let cookies = req.cookies;
    let token = cookies.jwt;
    let decodedToken = null;

    try {
        decodedToken = jwt.verify(token, CONSTANTS.JWT_SECRET);
    } catch (error) {
        //no token
    }

    logger.trace(decodedToken);
    next();
}

export default {
    configure
};