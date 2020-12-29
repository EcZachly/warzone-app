import {DAO} from './../Database';

import {TABLES} from '../../constants';

import {User, RawUser, UserList, RawUserList} from './UserTypes';
import {UserService} from './index';
import randomstring from 'randomstring';
import {Metadata} from "../../../src/components/Metadata/MetadataTypes";

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export function createUser(user: Partial<RawUser>): Promise<RawUser> {
    return new Promise((resolve, reject) => {
        user.confirm_string = randomstring.generate(10);
        user.metadata = JSON.stringify(createNewMetadata());
        return DAO.insert(TABLES.USERS, user).then((newUser: RawUser) => {
            if (newUser) {
                resolve(newUser);
            } else {
                reject(new Error('an unknown error occurred'));
            }
        }).catch(reject);
    });
}



export async function updateUser(query: Record<any, unknown>, user: Partial<RawUser>): Promise<RawUser> {
    try{
        return await DAO.update(TABLES.USERS, query, user);
    }
    catch(e){
        throw e;
    }
}





function createNewMetadata(obj: Record<any, unknown> = {}): Metadata {
    let defaultMetadata = {
        create_timestamp: new Date()
    };
    return {...defaultMetadata, ...obj};
}




export function queryUsers(query: Record<any, unknown>, queryOptions?: Record<any, object>, options: { sanitize: boolean } = {sanitize: true}): Promise<UserList | RawUserList> {
    return new Promise((resolve, reject) => {
        return DAO.find(TABLES.USERS, query, queryOptions).then((users) => {
            resolve((options.sanitize !== false) ? users.map(UserService.sanitizeUser) : users);
        }).catch(reject);
    });
}


export default {
    createUser,
    updateUser,
    queryUsers
};