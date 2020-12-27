import {DatabaseID} from './../Types';
import {Metadata} from '../Metadata/MetadataTypes';


export type UserID = DatabaseID;

export type UserMetadata = Metadata & {};

export type RawUser = {
    user_id: UserID,
    first_name: string,
    email: string,
    password: string,
    metadata: UserMetadata | String,
    confirm_string?: string,
    forgot_string?: string
};


export type RawUserList = RawUser[];


export type User = RawUser & {
    password: null,
    metadata: UserMetadata
};


export type UserList = User[];
