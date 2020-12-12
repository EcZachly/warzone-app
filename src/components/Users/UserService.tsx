import StorageService from './../Storage/StorageService';
import HttpService from '../../services/HttpService';

import {User, RawUser} from './UserTypes';

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

                resolve(user);
            } else {
                reject(response);
            }
        }).catch(reject);
    });
}



export function userIsLoggedIn() {
    return !!getUser();
}



export function getUser() {
    return StorageService.get('user');
}



export default {
    createUser,
    sanitizeUser,
    login
};