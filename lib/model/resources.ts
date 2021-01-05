import UtilityService from "../../src/services/UtilityService";
import {queryDatabase} from "../etl/utils";
import {RESOURCE_TABLE} from "../constants";

export function queryResources(query = {}, options = {}){
    query = UtilityService.validateItem(query, 'object', {});
    return queryDatabase(RESOURCE_TABLE, query, options);
}