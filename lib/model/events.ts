import {insertIntoDatabase} from '../etl/utils';
import {SITE_EVENTS} from '../constants';

export async function createEvent(event) {
    console.log(event);
    return insertIntoDatabase(event, SITE_EVENTS);
}