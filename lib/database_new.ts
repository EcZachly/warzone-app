const WARZONE_DATABASE_URL = ''; // new database url
if (typeof WARZONE_DATABASE_URL !== 'string' || WARZONE_DATABASE_URL.length < 1) {
    throw new Error('process.env.WARZONE_DATABASE_URL (String) is required and cannot be empty');
}
const DB_URL = WARZONE_DATABASE_URL + '?ssl=no-verify';

import massive from 'massive';

export default massive(DB_URL, {allowedSchemas: ['warzone']});