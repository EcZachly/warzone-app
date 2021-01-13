import {DATABASE_SCHEMA, MATERIALIZED_VIEWS_DEPENDENCIES} from '../../constants'
import {executeRawQuery} from "../../database_utils";
MATERIALIZED_VIEWS_DEPENDENCIES.forEach(async (key)=>{
    let query = "REFRESH MATERIALIZED VIEW CONCURRENTLY"  + DATABASE_SCHEMA + "." + key;
    await executeRawQuery(query);
});

