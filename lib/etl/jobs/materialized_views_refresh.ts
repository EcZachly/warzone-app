import {DATABASE_SCHEMA, MATERIALIZED_VIEWS_DEPENDENCIES} from '../../constants'
import {executeRawQuery} from "../utils";

Object.keys(MATERIALIZED_VIEWS_DEPENDENCIES).forEach(async (key)=>{
    let query = "REFRESH MATERIALIZED VIEW "  + DATABASE_SCHEMA + "." + key;
    let response = await executeRawQuery(query);
    console.log(key);
    console.log(response);
})

