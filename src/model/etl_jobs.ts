import {insertIntoDatabase, updateDatabaseRecords} from "../lib/etl/utils";
import {ETL_JOBS} from "../lib/constants";

export async function updateEtlJob(job) {
    let query = {
        job_id: job.job_id
    };
    return updateDatabaseRecords(query, job, ETL_JOBS);
}

export async function createEtlJob(job) {
    return insertIntoDatabase(job, ETL_JOBS);
}