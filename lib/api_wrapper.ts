import * as CallOfDutyAPI from 'call-of-duty-api';
import * as Bluebird from 'bluebird';
let EMAIL = process.env.WARZONE_EMAIL;
let PASSWORD = process.env.WARZONE_PASSWORD;

export default class ApiWrapper {
    private static API: CallOfDutyAPI;
    static getInstance(): CallOfDutyAPI {
        if (!ApiWrapper.API) {
            ApiWrapper.API = new CallOfDutyAPI({ratelimit: {maxRequests: 1, perMilliseconds: 10000, maxRPS: 1}});
        }

        if(ApiWrapper.API.isLoggedIn()){
            return Bluebird.resolve(ApiWrapper.API);
        }
        else{
            return ApiWrapper.API.login(EMAIL, PASSWORD).then(()=>{
                return ApiWrapper.API;
            })
        }
    }
}



