import database from './../../database';
import {DATABASE_SCHEMA} from './../../constants';



//===---==--=-=--==---===----===---==--=-=--==---===----//


export async function find(table: string, query?: Record<any, unknown>, options?: Record<any, unknown>) {
    const db = await database;
    return db[DATABASE_SCHEMA][table].find(query, options);
}



export async function insert(table: string, data: Record<any, unknown>) {
    return new Promise(async (resolve, reject) => {
        const db = await database;

        db[DATABASE_SCHEMA][table].insert(data).then(resolve).catch((error) => {
            const isDuplicateRecordError = (error.code === '23505');

            if (!isDuplicateRecordError) {
                console.log(error);
            }

            reject(error);
        });
    });
}



export async function update(table: string, query: Record<any, unknown>, data: Record<any, unknown>) {
    const db = await database;
    return await db[DATABASE_SCHEMA][table].update(query, data);
}



export default {
    find,
    insert,
    update
};