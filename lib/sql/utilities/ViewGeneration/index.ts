import tracer from 'tracer';
const logger = tracer.colorConsole();

import Bluebird from 'bluebird';

import database from './../../../database';

const basePath = __dirname + '/../..';
import {DATABASE_SCHEMA} from './../../../constants';

import {ViewConfigObject, ViewConfigList} from '../ViewConfigManager/viewConfig';
import ViewConfigManager from './../ViewConfigManager';
import SqlFileManager from './../SqlFileManager';

//===--=--=-==--=-=-=-=---==--=----=-==-======--=--=-==--=-=-=-=---==--=----=-==-===//

run();


async function run() {
    try {
        let startTime = new Date().getTime();

        let viewConfigList = await ViewConfigManager.getViewConfigList(basePath);
        await SqlFileManager.ensureCompleteData(viewConfigList);

        logger.info('This process will take at least 15 minutes');
        // await dropAllViews(viewConfigList);

        await recreateAllViews(viewConfigList);
        let endTime = new Date().getTime();

        let elapsedTimeMS = endTime - startTime;
        let elapsedTimeMinutes = Math.floor(elapsedTimeMS / 1000 / 60 * 10) / 10;

        logger.info(`it took ${elapsedTimeMinutes} to recreate all of the views`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}




async function recreateAllViews(viewConfigList) {
    return new Promise(async (resolve, reject) => {
        logger.trace('recreate all views');
        const db = await database;

        let totalViews = viewConfigList.length;

        let recreateResponse = await Bluebird.mapSeries(viewConfigList, async (viewConfig: ViewConfigObject) => {
            return new Promise(async (_resolve, _reject) => {
                logger.trace(` - ${viewConfig.position} of ${totalViews} ${viewConfig.path}`);

                try {
                    let response = await db.query(viewConfig.rawSQL);
                    _resolve(response);
                } catch (error) {
                    let {message} = error;

                    if (message.includes('already exists')) {
                        _resolve(message);
                    } else {
                        _reject(new Error(`${viewConfig.path} error: ${message}`));
                    }
                }
            });
        }).catch(reject);

        resolve(recreateResponse);
    });
}








