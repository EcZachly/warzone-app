import tracer from 'tracer';
const logger = tracer.colorConsole();

import Bluebird from 'bluebird';

import {DATABASE_SCHEMA, MATERIALIZED_VIEWS_DEPENDENCIES} from '../../constants';
import {executeRawQuery} from '../../database_utils';
import {DAO} from '../../components/Database';

const isDevMode = (process.env.NODE_ENV === 'development');
let time = {
    start: null,
    end: null
};

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

    return Bluebird.mapSeries(getViews(), (viewName) => {
        return DAO.validateTable(viewName);
    });
}



async function refreshMaterializedViews() {
    logger.trace('refreshing materialized views');

    return Bluebird.mapSeries(getViews(), (viewName, index, viewCount) => {
        return new Promise((resolve, reject) => {
            logger.trace(`refreshing view ${index + 1} of ${viewCount}: ${viewName}`);
            let startTime = new Date().getTime();

            executeRawQuery(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${DATABASE_SCHEMA}.${viewName}`).then((response) => {
                let endTime = new Date().getTime();

                resolve({
                    view: viewName,
                    duration: {
                        ms: endTime - startTime,
                        seconds: Math.floor(((endTime - startTime) / 1000) * 10) / 10
                    }
                });
            }, reject);
        });
    });
}



function getViews() {
    return MATERIALIZED_VIEWS_DEPENDENCIES;
}



function setTime(type) {
    time[type] = new Date().getTime();
}



function logJobDuration() {
    let timeDiffMS = time.end - time.start;
    let timeDiffSeconds = Math.floor(timeDiffMS / 1000 * 10) / 10;
    let averageTimePerView = Math.floor(getViews().length / timeDiffSeconds);

    logger.info(`It took ${timeDiffSeconds} seconds to complete the job with an average of ${averageTimePerView} seconds per view`);
}