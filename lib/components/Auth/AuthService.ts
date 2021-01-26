import {NextApiRequest, NextApiResponse} from 'next';
import crypto from 'crypto';
import moment from 'moment';
import jwt from 'jsonwebtoken';

import TypeService from '../../../src/services/TypeService';
import MOST_COMMON_PASSWORDS from './MOST_COMMON_PASSWORDS';
import UtilityService from '../../../src/services/UtilityService';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 130;

import CONSTANTS from './../../../config/CONSTANTS';
import {UserID} from '../../../src/components/Users/UserTypes';

const CONFIG = {
    ENCRYPTION: {
        ITERATIONS: 200 * 1000,
        SALT_LENGTH: 32,
        METHOD: 'sha256',
        OUTPUT_LENGTH: 32
    }
};

//--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//


export function validatePassword(password: string): boolean | string {
    if (TypeService.isString(password, true) === false) {
        return 'password (String) is required and cannot be empty';
    } else if (password.length < MIN_PASSWORD_LENGTH) {
        return 'password must be at least ' + MIN_PASSWORD_LENGTH + ' characters long';
    } else if (password.length > MAX_PASSWORD_LENGTH) {
        return 'password cannot be more than ' + MAX_PASSWORD_LENGTH + ' characters';
    } else if (passwordIsInListOfMostCommonPasswords(password)) {
        return 'password is in our list of 10,000 most commonly used passwords, please try again';
    } else {
        return true;
    }
}



export function encryptPassword(password: string, iterations?: number, salt?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (TypeService.isString(password, true) === false) {
            reject(new Error('password (String) is required'));
        } else {
            iterations = (iterations) ? iterations : CONFIG.ENCRYPTION.ITERATIONS;
            salt = (salt) ? salt : generateSalt();

            const hashMethod = CONFIG.ENCRYPTION.METHOD;
            const outputLength = CONFIG.ENCRYPTION.OUTPUT_LENGTH;

            crypto.pbkdf2(password, salt, iterations, outputLength, hashMethod, (error, derivedKey) => {
                if (error) {
                    reject(error);
                } else {
                    const storageValue = generateStorablePasswordString(iterations, salt, derivedKey);
                    resolve(storageValue);
                }
            });
        }
    });
}



export function comparePassword(unencryptedPassword: string, encryptedPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const {iterations, salt} = extractDetailsFromStoredPassword(encryptedPassword);

        encryptPassword(unencryptedPassword, iterations, salt).then((newlyEncryptedPassword) => {
            resolve(newlyEncryptedPassword === encryptedPassword);
        }, reject);
    });
}



export function setJWTTokenCookie(tokenStorageObj: { user_id: UserID }, res: NextApiResponse): void {
    const token = generateAuthToken({
        user_id: tokenStorageObj.user_id
    });

    // @ts-ignore
    res.cookie('jwt', token, {
        expires: _generateExpirationDate(),
        httpOnly: true
    });
}


export function generateAuthToken(tokenStorageObj: { user_id: UserID, [x: string]: any }): string {
    if (TypeService.isObject(tokenStorageObj) === false) {
        throw new Error('tokenStorageObj (Object) is required');
    } else if (TypeService.isInteger(tokenStorageObj.user_id) === false) {
        throw new Error('tokenStorageObj.user_id (Integer) is required');
    } else {
        tokenStorageObj.expiration_timestamp = _generateExpirationDate();
        return jwt.sign(tokenStorageObj, CONSTANTS.JWT_SECRET);
    }
}



export function _generateExpirationDate(): Date {
    return moment().add(7, 'days').toDate();
}



export function generateStorablePasswordString(iterations: number, salt: string, hash: Buffer | string): string {
    if (TypeService.isInteger(iterations) === false && TypeService.isString(iterations) === false) {
        throw new Error('iterations (Integer) is required');
    } else if (TypeService.isString(salt) === false && TypeService.isInteger(salt) === false) {
        throw new Error('salt (String | Integer) is required');
    } else if (TypeService.isObject(hash) === false && TypeService.isString(hash) === false) {
        throw new Error('hash (String | Object) is required');
    }

    return [
        iterations,
        salt,
        hash
    ].join(':');
}



export function extractDetailsFromStoredPassword(encryptedPassword: string): { iterations: number, salt: string, hash: string } {
    if (TypeService.isString(encryptedPassword) === false) {
        throw new Error('encryptedPassword (String) is required');
    }

    const passwordSplit = encryptedPassword.split(':');

    if (passwordSplit.length < 3) {
        throw new Error('encryptedPassword format is invalid');
    }

    const iterations = Number(passwordSplit[0]);
    passwordSplit.shift(); //remove the iterations

    const salt = '' + passwordSplit[0];
    passwordSplit.shift(); //remove the salt

    const hash = passwordSplit.join(':');

    return {
        iterations: iterations,
        salt: salt,
        hash: hash
    };
}


export function generateSalt(): string {
    return UtilityService.generateRandomNumberString(CONFIG.ENCRYPTION.SALT_LENGTH);
}



export function passwordIsInListOfMostCommonPasswords(password: string): boolean {
    return MOST_COMMON_PASSWORDS[password];
}



export function decodeJWTToken(token: string): Record<any, unknown> {
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, CONSTANTS.JWT_SECRET);
    } catch (error) {
        throw new Error('invalid token');
    }

    return decodedToken;
}



export function verifyJWTToken(decodedToken: { user_id: UserID, expiration_timestamp: Date }, options: Record<any, unknown>): Promise<string> {
    return new Promise((resolve, reject) => {
        options = (TypeService.isObject(options)) ? options : {};
        if (TypeService.isObject(decodedToken) === false) {
            reject(new Error('decodedToken (Object) is required'));
        } else if (TypeService.isInteger(decodedToken.user_id) === false) {
            reject(new Error('decodedToken.user_id (Integer) is required'));
        } else if (TypeService.isDate(decodedToken.expiration_timestamp, true) === false) {
            reject(new Error('decodedToken.expiration_timestamp (Timestamp) is required'));
        } else {
            const sessionStoredUserID = options.user_id;
            const userIDsMatch = ((!!sessionStoredUserID && sessionStoredUserID === decodedToken.user_id) || !sessionStoredUserID);

            if (userIDsMatch) {
                const expirationTimestamp = decodedToken.expiration_timestamp;
                const tokenHasExpired = new Date().getTime() > new Date(expirationTimestamp).getTime();

                if (tokenHasExpired === false) {
                    //todo: validate the session with the db, and update
                    resolve('valid');
                } else {
                    reject(new Error('token has expired'));
                }
            } else {
                reject(new Error('session stored user_id does not match the user_id in the token'));
            }
        }
    });
}



export default {
    validatePassword,
    encryptPassword,
    setJWTTokenCookie,
    decodeJWTToken,
    verifyJWTToken,
    passwordIsInListOfMostCommonPasswords,
    generateStorablePasswordString,
    extractDetailsFromStoredPassword,
    comparePassword
};