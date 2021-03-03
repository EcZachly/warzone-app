import tracer from 'tracer';
const logger = tracer.colorConsole();

import Bluebird from 'bluebird';

import {DATABASE_SCHEMA, VIEWS} from '../../constants';
import {executeRawQuery} from '../../database_utils';
import {DAO} from '../../components/Database';
import UtilityService from '../../../src/services/UtilityService';

const isDevMode = (process.env.NODE_ENV === 'development');
const time = {
    start: null,
    end: null
};


const minutesBetweenRuns = 10;
const jobsRunPerDay = Math.floor((24 * 60) / minutesBetweenRuns);

const MATERIALIZED_VIEWS_DEPENDENCY_LIST: Array<{ name: string, skip?: boolean, timesPerDay: number }> = [
    {
        name: VIEWS.GRADING_TABLE,
        timesPerDay: jobsRunPerDay
    },
    {
        name: VIEWS.GAMER_STAT_SUMMARY,
        timesPerDay: jobsRunPerDay
    },
    {
        name: VIEWS.SQUADS,
        timesPerDay: 1,
        skip: true
    },
    {
        name: VIEWS.GAMER_ROLLING_TRENDS,
        timesPerDay: jobsRunPerDay
    },
    {
        name: VIEWS.SQUAD_CLASS_DESCRIPTIONS,
        timesPerDay: 1
    },
    {
        name: VIEWS.GAMER_CLASS_DESCRIPTIONS,
        timesPerDay: 1
    },
    {
        name: VIEWS.GAMER_INFLUENCE_RELATIONSHIPS,
        timesPerDay: 1,
        skip: true
    },
    {
        name: VIEWS.DAILY_PLAYER_STAT_SUMMARY,
        timesPerDay: 1,
        skip: true
    },
    {
        name: VIEWS.GAMER_SITE_HITS,
        timesPerDay: 1,
        skip: true
    }
];

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



run();



async function run() {
    logger.info('STARTING JOB: refreshing materialized views');
    setTime('start');

    let response = null;
    let errorResponse = null;

    try {
        await validateViewNames();
        response = await refreshMaterializedViews();
    } catch (error) {
        errorResponse = error;
    }

    if (errorResponse) {
        logger.info('JOB FAILURE: refreshing materialized views');
        logger.error(errorResponse);
    } else {
        logger.info('JOB COMPLETE: refreshing materialized views');
        setTime('end');
        logJobDuration();

        if (isDevMode) {
            logger.info(response);
        }
    }
}



async function validateViewNames() {
    logger.trace('validating view names');

    return Bluebird.mapSeries(getViews(), ({name}) => {
        return DAO.validateTable(name);
    });
}



async function refreshMaterializedViews() {
    logger.trace('refreshing materialized views');

    return Bluebird.mapSeries(getViews(), (viewConfig, index, viewCount) => {
        return new Promise((resolve, reject) => {
            const {name, timesPerDay, skip} = viewConfig;

            let status = 'refreshing';

            if (skip === true) {
                status = 'skipping';
            } else if (jobShouldBeRun(timesPerDay) === false) {
                status = 'ignoring';
            }

            logger.trace(`${status} view ${index + 1} of ${viewCount}: ${name}`);

            if (status !== 'refreshing') {
                resolve({
                    view: name,
                    status: status
                });
            } else {
                const startTime = new Date().getTime();

                executeRawQuery(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${DATABASE_SCHEMA}.${name}`).then((response) => {
                    const endTime = new Date().getTime();

                    resolve({
                        view: name,
                        status: status,
                        duration: {
                            ms: endTime - startTime,
                            seconds: Math.floor(((endTime - startTime) / 1000) * 10) / 10
                        }
                    });
                }, reject);
            }
        });
    });
}



function jobShouldBeRun(timesPerDay) {
    if (timesPerDay === jobsRunPerDay) {
        return true;
    }

    const randomNumber = UtilityService.generateRandomInteger(0, 1000) / 1000;
    return randomNumber < (timesPerDay / jobsRunPerDay);
}



function getViews() {
    return MATERIALIZED_VIEWS_DEPENDENCY_LIST;
}



function setTime(type) {
    time[type] = new Date().getTime();
}



function logJobDuration() {
    const timeDiffMS = time.end - time.start;
    const timeDiffSeconds = Math.floor(timeDiffMS / 1000 * 10) / 10;
    const averageTimePerView = Math.floor(timeDiffSeconds / getViews().length);

    logger.info(`It took ${timeDiffSeconds} seconds to complete the job with an average of ${averageTimePerView} seconds per view`);
}