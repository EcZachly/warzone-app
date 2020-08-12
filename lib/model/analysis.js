import database from "../database.js";
import Bluebird from 'bluebird';
export function queryView(view, query){
    if(!query){
        query = {}
    }
    return database.then((db)=>{
        if(db[view]){
            return db[view].find(query)
        }
        else{
            return Bluebird.reject({message:"view " + view + " not found in database"});
        }
    });
}