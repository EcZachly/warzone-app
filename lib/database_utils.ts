import database from './database';
import {DATABASE_SCHEMA} from './constants';
//===---==--=-=--==---===----===---==--=-=--==---===----//

export async function queryDatabase(table, query, options = {}) {
    const db = await database;
    return db[DATABASE_SCHEMA][table].find(query, options);
}

export async function executeRawQuery(query) {

    const db = await database;

    try {
        return await db.query(query);
    } catch (failure) {
        return Promise.reject(failure);
    }
}

export async function updateDatabaseValues(query: object, data: Array<object> | object, table: string) {
    const db = await database;
    try {
        return await db[DATABASE_SCHEMA][table].update(query, data);
    } catch (failure) {
        console.log(failure);
    }
}

export async function insertDatabaseValues(data: Array<object> | object, table: string, upsertQuery: object = null) {
    const db = await database;
    try {
        return await db[DATABASE_SCHEMA][table].insert(data);
    } catch (failure) {
        const isDuplicateRecordError = failure.code === '23505';
        if (!isDuplicateRecordError) {
            console.log(failure);
        } else {
            if (upsertQuery) {
                return await updateDatabaseValues(upsertQuery, data, table);
            }
        }
    }
}

export async function queryView(view, query = {}, options = {}) {
    const db = await database;
    if (db[DATABASE_SCHEMA][view]) {
        return db[DATABASE_SCHEMA][view].find(query, options);
    } else if (db[view]) {
        return db[view](Object.values(query));
    } else {
        return Promise.reject({message: 'view ' + view + ' not found in database'});
    }
}

export async function refreshMaterializedView(view) {
    const db = await database;
    if (db[DATABASE_SCHEMA][view]) {
        return db[DATABASE_SCHEMA].run(`REFRESH MATERIALIZED VIEW ${view}`);
    } else {
        return Promise.reject({message: 'view ' + view + ' not found in database'});
    }
}