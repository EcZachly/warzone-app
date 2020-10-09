import {insertIntoDatabase, updateDatabaseRecords} from '../etl/utils';
import {ETL_JOBS} from '../constants';

export async function updateEtlJob(job) {
    const query = {
        job_id: job.job_id
    };
    return updateDatabaseRecords(query, job, ETL_JOBS);
}

export async function createEtlJob(job) {
    return insertIntoDatabase(job, ETL_JOBS);
}