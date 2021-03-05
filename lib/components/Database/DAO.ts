import database from './../../database';
import {DATABASE_SCHEMA} from './../../constants';
import {AnyObject} from '../Types';

export type QueryOptions = {
    limit?: number,
    offset?: number,
    fields?: string[],
    order?: OrderObject[]
}


export type OrderObject = {
    field: string,
    direction: 'desc' | 'asc',
    nulls?: 'first' | 'last',
}

//===---==--=-=--==---===----===---==--=-=--==---===----//


export async function find(table: string, query?: AnyObject, options?: QueryOptions): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
        validateTable(table).then(async (isValid) => {
            const db = await database;

            db[DATABASE_SCHEMA][table].find(query, options).then(resolve).catch(reject);
        }).catch(reject);
    });
}



export async function insert(table: string, data: AnyObject): Promise<any> {
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



export async function update(table: string, query: AnyObject, data: AnyObject): Promise<any> {
    const db = await database;
    return await db[DATABASE_SCHEMA][table].update(query, data);
}



export async function destroy(table: string, query: AnyObject): Promise<any> {
    const db = await database;
    return await db[DATABASE_SCHEMA][table].destroy(query);
}



export async function validateTable(table: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const db = await database;

        if (db[DATABASE_SCHEMA][table]) {
            resolve(true);
        } else {
            reject(new Error('invalid table/view name: ' + table));
        }
    });
}



export async function closeConnection() {
    const db = await database;

    try {
        db.instance.$pool.end();
    } catch (error) {
        console.error(error);
    }
}



export default {
    find,
    insert,
    update,
    destroy,
    validateTable,
    closeConnection
};