const WARZONE_DATABASE_URL = '<database_url>';
const DB_URL = WARZONE_DATABASE_URL + '?ssl=no-verify';

import massive from 'massive';

export default massive(DB_URL, {allowedSchemas: ['warzone']});