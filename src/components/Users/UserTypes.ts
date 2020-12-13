import {DatabaseID} from './../Types';


export type UserID = DatabaseID;

export type RawUser = {
    user_id: UserID,
    first_name: string,
    email: string,
    password: string,
};


export type RawUserList = RawUser[];


export type User = RawUser & {
    password: null
};


export type UserList = User[];
