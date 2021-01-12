import {insertIntoDatabase} from '../etl/utils';
import {TABLES} from '../constants';

export async function createEvent(event) {
    return insertIntoDatabase(event, TABLES.SITE_EVENTS);
}