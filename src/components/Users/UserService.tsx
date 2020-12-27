import StorageService from './../Storage/StorageService';
import HttpService from '../../services/HttpService';

import {RawUser, User} from './UserTypes';
import {GamerRelationshipService} from '../GamerRelationships';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export function createUser(user: Partial<RawUser>): Promise<User> {
    return new Promise((resolve, reject) => {
        HttpService.http({
            method: 'POST',
            url: '/api/users',
            body: {
                user
            }
        }).then((response) => {
            if (response.status === 200) {
                resolve(response.data);
            } else {
                reject(response);
            }
        }).catch(reject);
    });
}


export function sendForgotPassword(email) {
    return HttpService.http({
        method: 'POST',
        url: '/api/forgot-password',
        body: {
            email: email
        }
    })
}

export function sanitizeUser(user) {
    delete user.password;
    return user;
}


export function login(loginDetails: { email: string, password: string }): Promise<User> {
    return new Promise((resolve, reject) => {
        HttpService.http({
            method: 'POST',
            url: '/api/login',
            body: loginDetails
        }).then((response) => {
            if (response.status === 200) {
                let user = response.data.user;

                StorageService.save('user', user);
                StorageService.save('auth-token-manually-verified', true, {session: true});

                console.log(StorageService.get('user'));
                console.log(userIsLoggedIn());

                GamerRelationshipService.queryGamerRelationships({user_id: user.user_id}).finally();

                resolve(user);
            } else {
                reject(response);
            }
        }).catch(reject);
    });
}


export function userIsLoggedIn() {
    let userIsLoggedIn = false;

    try {
        userIsLoggedIn = !!getUser();
    } catch (e) {

    }

    return userIsLoggedIn;
}


export function userHasBeenRedirectedAlready() {
    return StorageService.get('user-has-been-redirected', {temp: true}) === true;
}


export function setUserHasBeenRedirected() {
    StorageService.save('user-has-been-redirected', true, {temp: true});
}


export function getUser() {
    return StorageService.get('user');
}


export function logout() {
    StorageService.clear();
}


export function currentSessionTokenHasBeenVerified() {
    return StorageService.get('auth-token-manually-verified', {session: true});
}


export function sanitizeEmailForStorage(email) {
    return email.toLowerCase().trim();
}


export function verifyCurrentUserAndToken() {
    return new Promise((resolve, reject) => {
        if (userIsLoggedIn()) {
            let user = getUser();

            HttpService.http({
                url: '/api/v1/verify-user-token',
                method: 'POST',
                body: {
                    user_id: user.user_id
                }
            }).then((response) => {
                if (response.status === 200) {
                    resolve(response);
                } else {
                    reject(response);
                }
            }, reject);
        } else {
            reject(new Error('user is not logged in'));
        }
    });
}


export default {
    createUser,
    sendForgotPassword,
    sanitizeUser,
    login,
    sanitizeEmailForStorage,
    getUser,
    userIsLoggedIn,
    currentSessionTokenHasBeenVerified,
    verifyCurrentUserAndToken,
    logout,
    userHasBeenRedirectedAlready,
    setUserHasBeenRedirected
};