import HttpService from '../../services/HttpService';

import {User, RawUser} from './UserTypes';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export function createUser(user: Partial<RawUser>): Promise<User> {
    return new Promise((resolve, reject) => {
        HttpService.http({
            method: 'POST',
            url: '/api/v1/users',
            body: {
                user: user
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



export default {
    createUser
};