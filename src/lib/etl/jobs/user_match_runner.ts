import { runBackfills, runUpdates } from '../user_match_scrape'
import { createEtlJob, updateEtlJob } from '../../../model/etl_jobs'
import { argv } from 'yargs'
import md5 from 'md5'

const jobType: string = argv.jobType as string;

const validJobTypes: Array<string> = ['update','backfill']
if (!jobType || !validJobTypes.includes(jobType)) {
    throw new Error('option jobType is required and needs to be in ' + validJobTypes.join(','));
}
let jobNames = {
    update: 'user_matches_update',
    backfill: 'user_matches_backfill'
}
let jobTime: number = new Date().getTime();
let newJob = {
    job_name: jobNames[jobType],
    job_id: md5(jobTime + jobNames[jobType]),
    execution_start_time: jobTime,
    is_successful: null,
    execution_end_time: null
}

let jobFunctions = {
    update: runUpdates,
    backfill: runBackfills
}
async function run() {
    let jobFunction = jobFunctions[jobType];
    await createEtlJob(newJob);
    try {
        await jobFunction();
        newJob.is_successful = true;
    }
    catch (e) {
        newJob.is_successful = false;

    }
    let jobEndTime: number = new Date().getTime();
    newJob.execution_end_time = jobEndTime;
    await updateEtlJob(newJob);
}

run();