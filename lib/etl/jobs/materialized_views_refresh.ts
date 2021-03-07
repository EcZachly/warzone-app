import tracer from 'tracer';
const logger = tracer.colorConsole();
import moment from 'moment';

import Bluebird from 'bluebird';

import {DATABASE_SCHEMA, VIEWS} from '../../constants';
import {executeRawQuery} from '../../database_utils';
import {DAO} from '../../components/Database';
import UtilityService from '../../../src/services/UtilityService';

import MaterializedViewRefreshController
    from '../../components/MaterializedViewRefresh/MaterializedViewRefreshController';

const isDevMode = (process.env.NODE_ENV === 'development');
const time = {
    start: null,
    end: null
};


const minutesBetweenRuns = 10;
const jobsRunPerDay = Math.floor((24 * 60) / minutesBetweenRuns);

const JOB_RUN_TIMES = {
    EVERY_10_MINUTES: minutesBetweenRuns,
    HOURLY: 60,
    EVERY_4_HOURS: 60 * 4,
    EVERY_6_HOURS: 60 * 6,
    TWICE_PER_DAY: 60 * 12,
    ONCE_PER_DAY: 60 * 24
};


const MATERIALIZED_VIEWS_DEPENDENCY_LIST: Array<{ name: string, skip?: boolean, minutesBetweenRunning: number }> = [
    {
        name: VIEWS.GAMER_STAT_SUMMARY,
        minutesBetweenRunning: JOB_RUN_TIMES.HOURLY
    },
    {
        name: VIEWS.GAMER_ROLLING_TRENDS,
        minutesBetweenRunning: JOB_RUN_TIMES.HOURLY
    },
    {
        name: VIEWS.GRADING_TABLE,
        minutesBetweenRunning: JOB_RUN_TIMES.TWICE_PER_DAY
    },
    {
        name: VIEWS.SQUADS,
        minutesBetweenRunning: JOB_RUN_TIMES.ONCE_PER_DAY,
        skip: true
    },
    {
        name: VIEWS.SQUAD_CLASS_DESCRIPTIONS,
        minutesBetweenRunning: JOB_RUN_TIMES.ONCE_PER_DAY
    },
    {
        name: VIEWS.GAMER_CLASS_DESCRIPTIONS,
        minutesBetweenRunning: JOB_RUN_TIMES.ONCE_PER_DAY
    },
    {
        name: VIEWS.GAMER_INFLUENCE_RELATIONSHIPS,
        minutesBetweenRunning: JOB_RUN_TIMES.ONCE_PER_DAY,
        skip: true
    },
    {
        name: VIEWS.DAILY_PLAYER_STAT_SUMMARY,
        minutesBetweenRunning: JOB_RUN_TIMES.ONCE_PER_DAY,
        skip: true
    },
    {
        name: VIEWS.GAMER_SITE_HITS,
        minutesBetweenRunning: JOB_RUN_TIMES.ONCE_PER_DAY,
        skip: true
    }
];

let IS_REFRESHING = null;

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



run();



async function run() {
    logger.info('STARTING JOB: refreshing materialized views');
    setTime('start');

    const response = null;
    let errorResponse = null;

    try {
        await validateViewNames();
        await testAndRefreshMaterializedView();
    } catch (error) {
        errorResponse = error;
    }

    console.log(errorResponse);



    // IS_REFRESHING = null;
    //
    // if (errorResponse) {
    //     logger.info('JOB FAILURE: refreshing materialized views');
    //     logger.error(errorResponse);
    // } else {
    //     logger.info('JOB COMPLETE: refreshing materialized views');
    //     setTime('end');
    //     logJobDuration();
    //
    //     if (isDevMode) {
    //         logger.info(response);
    //     }
    // }
}



async function validateViewNames() {
    logger.trace('validating view names');

    return Bluebird.mapSeries(getViews(), ({name}) => {
        return DAO.validateTable(name);
    });
}



async function testAndRefreshMaterializedView(position = 0) {
    const selectedViewObj = getViews()[position];

    if (!selectedViewObj) {
        finishJob();
    } else if (selectedViewObj.skip === true) {
        console.log('skipping view');
        return testAndRefreshMaterializedView(position + 1);
    }

    console.log(`checking view (${selectedViewObj.name})`);

    const mostRecentRefreshes = await MaterializedViewRefreshController.queryMaterializedViewRefresh({
        view_id: selectedViewObj.name
    }, {
        limit: 1,
        order: [
            {
                field: 'refresh_id',
                direction: 'desc'
            }
        ]
    });
    let mostRecentRefresh;

    if (mostRecentRefreshes.length > 0) {
        mostRecentRefresh = mostRecentRefreshes[0];
    }

    let viewShouldBeRefreshed = !mostRecentRefresh;

    if (mostRecentRefresh) {
        const {status, end_timestamp, start_timestamp} = mostRecentRefresh;

        if (status === 'success') {
            const minutesSinceRefreshEnded = moment().diff(moment(end_timestamp), 'minute');
            const minMinutesBetweenRefreshes = selectedViewObj.minutesBetweenRunning;

            console.log(`most recent refresh was ${minutesSinceRefreshEnded} minutes ago`);
            console.log(`min time between refreshes: ${minMinutesBetweenRefreshes}`);

            if (minutesSinceRefreshEnded > minMinutesBetweenRefreshes) {
                viewShouldBeRefreshed = true;
            }
        } else if (status === 'in progress') {
            const minutesSinceStart = moment().diff(moment(start_timestamp), 'minute');

            if (minutesSinceStart >= (24 * 60)) {
                console.log('has been more than 24 hours since view was started, refreshing');
                viewShouldBeRefreshed = true;
            }
        } else {
            console.log('view doesn\'t have success or in progress status, refreshing');
            viewShouldBeRefreshed = true;
        }
    }

    if (viewShouldBeRefreshed) {
        console.log('view is refreshing');

        try {
            if (mostRecentRefresh && mostRecentRefresh.duration_seconds) {
                const durationMinutes = Math.floor(mostRecentRefresh.duration_seconds / 60);

                if (durationMinutes > 5) {
                    console.log(`should take about ${durationMinutes} minutes`);
                }
            }

            const newViewRefresh = await MaterializedViewRefreshController.createMaterializedViewRefresh({
                view_id: selectedViewObj.name,
                start_timestamp: new Date(),
                status: 'in progress'
            });

            const startTime = new Date().getTime();

            IS_REFRESHING = startTime;
            logRefreshingStatus(selectedViewObj.name);

            try {
                const response = await executeRawQuery(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${DATABASE_SCHEMA}.${selectedViewObj.name}`);
                newViewRefresh.status = 'success';
            } catch (error) {
                console.error(error);
                newViewRefresh.error_message = error.message;
                newViewRefresh.status = 'failure';
            }

            IS_REFRESHING = null;
            newViewRefresh.end_timestamp = new Date();
            newViewRefresh.duration_seconds = Math.floor((newViewRefresh.end_timestamp.getTime() - newViewRefresh.start_timestamp.getTime()) / 1000);

            await MaterializedViewRefreshController.updateMaterializedViewRefresh({
                refresh_id: newViewRefresh.refresh_id
            }, newViewRefresh);

            finishJob();
        } catch (error) {
            finishJob();
        }
    } else {
        console.log('view will not be refreshed now, testing next view');
        return testAndRefreshMaterializedView(position + 1);
    }

}


function finishJob() {
    console.log('job finished');
    IS_REFRESHING = null;
    // DAO.closeConnection();
}



function logRefreshingStatus(view) {
    if (IS_REFRESHING) {

        const currentTime = new Date().getTime();
        const timeDiffSeconds = Math.floor((currentTime - IS_REFRESHING) / 1000);
        const timeDiffType = (timeDiffSeconds >= 3 * 60) ? 'minutes' : 'seconds';
        const timeDiffUnit = timeDiffType === 'minutes' ? Math.floor(timeDiffSeconds / 60) : timeDiffSeconds;

        const secondsBetweenLogTimes = timeDiffType === 'minutes' ? 60 : 15;

        console.log('refreshing ' + (view || '') + ' - elapsed time: ' + timeDiffUnit + ' ' + timeDiffType);

        setTimeout(() => {
            logRefreshingStatus(view);
        }, secondsBetweenLogTimes * 1000);
    }
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