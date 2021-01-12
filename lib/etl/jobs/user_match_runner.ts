import {argv} from 'yargs';
import md5 from 'md5';

import {runBackfills, refreshFollowedGamers, runUpdates} from '../user_match_scrape';
import {createEtlJob, updateEtlJob} from '../../model/etl_jobs';

const CONFIG = {
    JOBS: {
        update: {
            name: 'user_matches_update',
            method: runUpdates
        },
        backfill: {
            name: 'user_matches_backfill',
            method: runBackfills
        },
        followed_users: {
            name: 'followed_users',
            method: refreshFollowedGamers
        }
    }
};

const VALID_JOB_KEYS = Object.keys(CONFIG.JOBS);

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



run();


function run() {
    const jobType = argv.jobType as string;
    const jobConfig = CONFIG.JOBS[jobType];

    if (jobConfig) {
        executeJob(jobConfig);
    } else {
        throw new Error('option jobType is required and must be one of the following: ' + JSON.stringify(VALID_JOB_KEYS));
    }
}


async function executeJob(jobConfig) {
    const jobTime: number = new Date().getTime();

    let newJob = {
        job_name: jobConfig.name,
        job_id: md5(jobTime + jobConfig.name),
        execution_start_time: jobTime,
        is_successful: null,
        execution_end_time: null
    };

    const jobFunction = jobConfig.method;
    await createEtlJob(newJob);

    try {
        await jobFunction();
        newJob.is_successful = true;
    } catch (e) {
        console.error(e);
        newJob.is_successful = false;
    }

    newJob.execution_end_time = new Date().getTime();

    await updateEtlJob(newJob);
}