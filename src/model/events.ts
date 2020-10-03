import {insertIntoDatabase} from "../lib/etl/utils";
import {SITE_EVENTS} from "../lib/constants";

export async function createEvent(event) {
    return insertIntoDatabase(event, SITE_EVENTS);
}