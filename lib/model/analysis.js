import database from "../database.js";
import Bluebird from 'bluebird';
import {DATABASE_SCHEMA} from "../constants";

export function queryView(view, query){
    if(!query){
        query = {}
    }
    return database.then((db)=>{
        if(db[DATABASE_SCHEMA][view]){
            return db[DATABASE_SCHEMA][view].find(query)
        }
        else{
            return Bluebird.reject({message:"view " + view + " not found in database"});
        }
    });
}