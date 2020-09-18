import database from "../database.js";
import apiLib from 'call-of-duty-api';
import {insertIntoDatabase} from "../etl/utils";
import WarzoneMapper from "../etl/mapper";
import {GAMER_TABLE} from "../constants";
const API = apiLib({platform: "battle", ratelimit: {maxRequests: 2, perMilliseconds: 1000, maxRPS: 2}});
let EMAIL = process.env.WARZONE_EMAIL;
let PASSWORD = process.env.WARZONE_PASSWORD;
export function getGamerFromAPI(username, platform) {
    return API.login(EMAIL, PASSWORD).then(() => {
        return API.MWwz(username, platform);
    });
}

export function initializeGamer(queryGamer) {
    return API.login(EMAIL, PASSWORD).then((api)=>{
        return API.MWwz(queryGamer.username, queryGamer.platform).then((gamer) => {
            return insertIntoDatabase(WarzoneMapper.mapGamer(gamer), GAMER_TABLE);
        });
    })
}


export function queryGamers(query = null){
    if(!query){
        query = {}
    }
    return database.then((db)=>{
        return db.gamers.find(query)
    });
}