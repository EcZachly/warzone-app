import database from './../../database';
import {DATABASE_SCHEMA} from './../../constants';



//===---==--=-=--==---===----===---==--=-=--==---===----//


export async function find(table: string, query?: Record<any, unknown>, options?: Record<any, unknown>): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
        validateTable(table).then(async (isValid) => {
            const db = await database;

            db[DATABASE_SCHEMA][table].find(query, options).then(resolve).catch(reject);
        }).catch(reject);
    });
}



export async function insert(table: string, data: Record<any, unknown>): Promise<any> {
    return new Promise(async (resolve, reject) => {
        validateTable(table).then(async (isValid) => {
            const db = await database;

            db[DATABASE_SCHEMA][table].insert(data).then(resolve).catch((error) => {
                const isDuplicateRecordError = (error.code === '23505');

                if (!isDuplicateRecordError) {
                    console.log(error);
                }

                reject(error);
            });
        }).catch(reject);
    });
}



export async function update(table: string, query: Record<any, unknown>, data: Record<any, unknown>) {
    const db = await database;
    return await db[DATABASE_SCHEMA][table].update(query, data);
}



export async function destroy(table: string, query: Record<any, unknown>) {
    const db = await database;
    return await db[DATABASE_SCHEMA][table].destroy(query);
}



export async function validateTable(table) {
    return new Promise(async (resolve, reject) => {
        const db = await database;

        if (db[DATABASE_SCHEMA][table]) {
            resolve(true);
        } else {
            reject(new Error('invalid table/view name: ' + table));
        }
    });
}



export default {
    find,
    insert,
    update,
    destroy,
    validateTable
};