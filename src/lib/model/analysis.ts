import database from "../database";
import Bluebird from 'bluebird';
import {DATABASE_SCHEMA} from "../constants";

export async function queryView(view, query = {}){
    let db = await database;
    if(db[DATABASE_SCHEMA][view]){
        return db[DATABASE_SCHEMA][view].find(query)
    }
    else if(db[view]){
        return db[view](Object.values(query))
    }
    else{
        return Bluebird.reject({message:"view " + view + " not found in database"});
    }
}