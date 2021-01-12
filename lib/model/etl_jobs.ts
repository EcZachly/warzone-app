import {insertDatabaseValues, updateDatabaseValues} from '../database_utils';
import {TABLES} from '../constants';

export async function updateEtlJob(job) {
    const query = {
        job_id: job.job_id
    };
    return updateDatabaseValues(query, job, TABLES.ETL_JOBS);
}

export async function createEtlJob(job) {
    return insertDatabaseValues(job, TABLES.ETL_JOBS);
}