import process from '../environment';
let WARZONE_DATABASE_URL = process.env.WARZONE_DATABASE_URL;

if (typeof WARZONE_DATABASE_URL !== 'string' || WARZONE_DATABASE_URL.length < 1) {
	throw new Error('process.env.WARZONE_DATABASE_URL (String) is required and cannot be empty');
}
let DB_URL = WARZONE_DATABASE_URL + '?ssl=no-verify'

import * as massive from 'massive';

export default massive({connectionString : DB_URL});