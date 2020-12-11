



export type RawUser = {
    first_name: string,
    email: string,
    password: string,
};


export type RawUserList = RawUser[];


export type User = RawUser & {
    password: null
};


export type UserList = User[];
