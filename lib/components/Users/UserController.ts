import {DAO} from './../Database';

import {TABLES} from '../../constants';

import {User, RawUser} from './UserTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export function createUser(user: Partial<RawUser>): Promise<User> {
    return new Promise((resolve, reject) => {
        DAO.insert(TABLES.USERS, user).then((users) => {
            if (users && users[0]) {
                resolve(users[0]);
            } else {
                reject(new Error('an unknown error occurred'));
            }
        }).catch(reject);
    });
}


export default {
    createUser
};