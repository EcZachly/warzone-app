import database from "../database";
import Bluebird from 'bluebird';
import {DATABASE_SCHEMA} from "../constants";

export async function queryView(view, query = {}, options = {}){
    let db = await database;
    console.log(db);
    console.log(query, options);
    if(db[DATABASE_SCHEMA][view]){
        return db[DATABASE_SCHEMA][view].find(query, options)
    }
    else if(db[view]){
        return db[view](Object.values(query))
    }
    else{
        return Bluebird.reject({message:"view " + view + " not found in database"});
    }
}