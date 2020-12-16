import {DAO} from './../Database';

import {TABLES} from '../../constants';

import {User, RawUser, UserList, RawUserList} from './UserTypes';
import {UserService} from './index';
import {MetadataService} from '../../../src/components/Metadata';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export function createUser(user: Partial<RawUser>): Promise<RawUser> {
    return new Promise((resolve, reject) => {
        user.metadata = JSON.stringify(MetadataService.createNewMetadata());

        DAO.insert(TABLES.USERS, user).then((newUser: RawUser) => {
            if (newUser) {
                resolve(newUser);
            } else {
                reject(new Error('an unknown error occurred'));
            }
        }).catch(reject);
    });
}



export function queryUsers(query: Record<any, object>, queryOptions?: Record<any, object>, options: { sanitize: boolean } = {sanitize: true}): Promise<UserList | RawUserList> {
    return new Promise((resolve, reject) => {
        DAO.find(TABLES.USERS, query, queryOptions).then((users) => {
            resolve((options.sanitize !== false) ? users.map(UserService.sanitizeUser) : users);
        }).catch(reject);
    });
}


export default {
    createUser,
    queryUsers
};