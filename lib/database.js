let DB_URL = process.env.WARZONE_DATABASE_URL + '?ssl=no-verify'
import massive from 'massive';
export default massive({connectionString : DB_URL});