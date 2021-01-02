import StorageService from './../Storage/StorageService';
import HttpService from '../../services/HttpService';

import {RawUser, User} from './UserTypes';
import {Gamer} from './../gamer/GamerTypes';
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

export function finishForgotPassword(user) {
    return HttpService.http({
        method: 'PUT',
        url: '/api/forgot-password',
        body: {
            user: user
        }
    });
}

export function sendForgotPassword(email) {
    return new Promise((resolve, reject) => {
        HttpService.http({
            method: 'POST',
            url: '/api/forgot-password',
            body: {
                email: email
            }
        }).then((response) => {
            if (response.status === 200) {
                resolve(response);
            } else {
                reject(response);
            }
        }).catch(reject);
    });
}

export function sanitizeUser(user) {
    delete user.password;
    return user;
}


export async function login(loginDetails: { email: string, password: string }): Promise<User> {
    return new Promise((resolve, reject) => {
        HttpService.http({
            method: 'POST',
            url: '/api/login',
            body: loginDetails
        }).then(async (response) => {
            if (response.status === 200) {
                let user = response.data.user;

                StorageService.save('user', user);
                StorageService.save('auth-token-manually-verified', true, {session: true});

                await GamerRelationshipService.queryGamerRelationships({user_id: user.user_id}).finally();

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


export function gamerIsFriend(platform: Gamer['platform'], username: Gamer['username']): boolean {
    let gamerRelationships = GamerRelationshipService.getGamerRelationshipsFromStorage();
    return gamerRelationships.filter((gamerRelationship) => gamerRelationship.platform === platform && gamerRelationship.username === username).length > 0;
}


export function gamerIsSelf(platform: Gamer['platform'], username: Gamer['username']): boolean {
    let gamerRelationships = GamerRelationshipService.getGamerRelationshipsFromStorage();
    return gamerRelationships.filter((gamerRelationship) => gamerRelationship.platform === platform && gamerRelationship.username === username && gamerRelationship.type === 'self').length > 0;
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
    finishForgotPassword,
    sendForgotPassword,
    sanitizeUser,
    login,
    gamerIsSelf,
    sanitizeEmailForStorage,
    getUser,
    userIsLoggedIn,
    currentSessionTokenHasBeenVerified,
    verifyCurrentUserAndToken,
    logout,
    userHasBeenRedirectedAlready,
    setUserHasBeenRedirected,
    gamerIsFriend
};