import {insertDatabaseValues} from '../database_utils';
import {TABLES} from '../constants';

export async function createEvent(event) {
    return insertDatabaseValues(event, TABLES.SITE_EVENTS);
}