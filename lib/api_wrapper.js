import apiLib from 'call-of-duty-api';
import Bluebird from 'bluebird';
const API = apiLib({ratelimit: {maxRequests: 1, perMilliseconds: 10000, maxRPS: 1}});
let EMAIL = process.env.WARZONE_EMAIL;
let PASSWORD = process.env.WARZONE_PASSWORD;

export function login(){
    console.log('API IS CURRENTLY LOGGED IN? ' + API.isLoggedIn());
    if(API.isLoggedIn()){
        return Bluebird.resolve(API);
    }
    else{
        return API.login(EMAIL, PASSWORD).then(()=>{
            return API;
        })
    }
}



