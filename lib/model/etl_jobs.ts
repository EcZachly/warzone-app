import {insertIntoDatabase, updateDatabaseRecords} from '../etl/utils';
import {TABLES} from '../constants';

export async function updateEtlJob(job) {
    const query = {
        job_id: job.job_id
    };
    return updateDatabaseRecords(query, job, TABLES.ETL_JOBS);
}

export async function createEtlJob(job) {
    return insertIntoDatabase(job, TABLES.ETL_JOBS);
}