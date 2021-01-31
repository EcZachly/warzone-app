import database from './database';
import {DATABASE_SCHEMA} from './constants';

type AnyObject = Record<any, unknown>
type DatabaseResponse = AnyObject[] | AnyObject | any;
type DatabaseEntry = AnyObject[] | AnyObject;

//===---==--=-=--==---===----===---==--=-=--==---===----//



export async function queryDatabase(table: string, query: AnyObject, options = {}): Promise<DatabaseResponse> {
    const db = await database;
    return db[DATABASE_SCHEMA][table].find(query, options);
}



export async function executeRawQuery(query: AnyObject): Promise<DatabaseResponse> {
    const db = await database;

    try {
        return await db.query(query);
    } catch (failure) {
        return Promise.reject(failure);
    }
}



export async function updateDatabaseValues(query: AnyObject, data: DatabaseEntry, table: string): Promise<DatabaseResponse> {
    const db = await database;

    try {
        return await db[DATABASE_SCHEMA][table].update(query, data);
    } catch (failure) {
        console.log(failure);
    }
}



export async function insertDatabaseValues(data: DatabaseEntry, table: string, writeOptions = {}): Promise<DatabaseResponse> {
    const db = await database;

    try {
        return await db[DATABASE_SCHEMA][table].insert(data, writeOptions);
    } catch (failure) {
        const isDuplicateRecordError = failure.code === '23505';
        if (!isDuplicateRecordError) {
            console.log(failure);
        }
    }
}



export async function queryView(view: string, query = {}, options = {}): Promise<DatabaseResponse> {
    const db = await database;

    if (db[DATABASE_SCHEMA][view]) {
        return db[DATABASE_SCHEMA][view].find(query, options);
    } else if (db[view]) {
        return db[view](Object.values(query));
    } else {
        return Promise.reject({message: 'view ' + view + ' not found in database'});
    }
}



export async function refreshMaterializedView(view: string): Promise<DatabaseResponse> {
    const db = await database;

    if (db[DATABASE_SCHEMA][view]) {
        return db[DATABASE_SCHEMA].run(`REFRESH MATERIALIZED VIEW ${view}`);
    } else {
        return Promise.reject({message: 'view ' + view + ' not found in database'});
    }
}