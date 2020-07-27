import database from "../database.js";




export function queryGamers(query = null){
    if(!query){
        query = {}
    }
    return database.then((db)=>{
        return db.gamers.find(query)
    });
}