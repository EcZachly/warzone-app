import database from "../database";
import * as Bluebird from 'bluebird';
import {DATABASE_SCHEMA} from "../constants";

export async function queryView(view, query = {}){
    let db = await database;
    if(db[DATABASE_SCHEMA][view]){
        return db[DATABASE_SCHEMA][view].find(query)
    }
    else{
        return Bluebird.reject({message:"view " + view + " not found in database"});
    }
}