import crypto from 'crypto';

import TypeService from '../../../src/services/TypeService';
import MOST_COMMON_PASSWORDS from './MOST_COMMON_PASSWORDS';
import UtilityService from '../../../src/services/UtilityService';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 130;

const CONFIG = {
    ENCRYPTION: {
        ITERATIONS: 200 * 1000,
        SALT_LENGTH: 32,
        METHOD: 'sha256',
        OUTPUT_LENGTH: 32
    }
};

//--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//


export function validatePassword(password): boolean | string {
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



export function extractDetailsFromStoredPassword(encryptedPassword: string): { iterations, salt, hash } {
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



export function passwordIsInListOfMostCommonPasswords(password): boolean {
    return MOST_COMMON_PASSWORDS[password];
}



export default {
    validatePassword,
    encryptPassword,
    passwordIsInListOfMostCommonPasswords,
    generateStorablePasswordString,
    extractDetailsFromStoredPassword,
    comparePassword
};