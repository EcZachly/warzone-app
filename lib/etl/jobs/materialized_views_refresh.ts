import {DATABASE_SCHEMA, MATERIALIZED_VIEWS_DEPENDENCIES} from '../../constants'
import {executeRawQuery} from "../utils";
MATERIALIZED_VIEWS_DEPENDENCIES.forEach(async (key)=>{
    let query = "REFRESH MATERIALIZED VIEW "  + DATABASE_SCHEMA + "." + key;
    await executeRawQuery(query);
});

