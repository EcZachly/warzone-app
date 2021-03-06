import UtilityService from '../../src/services/UtilityService';
import {queryDatabase} from '../database_utils';
import {TABLES} from '../constants';

export function queryResources(query = {}, options = {}){
    query = UtilityService.validateItem(query, 'object', {});
    return queryDatabase(TABLES.RESOURCES, query, options);
}