import tracer from 'tracer';
const logger = tracer.colorConsole();

import Bluebird from 'bluebird';

import database from './../../../database';

const prompts = require('prompts');

const basePath = __dirname + '/../..';
import {DATABASE_SCHEMA} from './../../../constants';

import ViewConfigManager from './../ViewConfigManager';
import SqlFileManager from './../SqlFileManager';

//===--=--=-==--=-=-=-=---==--=----=-==-======--=--=-==--=-=-=-=---==--=----=-==-===//

run();



async function run() {
    try {
        let viewConfigList = await ViewConfigManager.getViewConfigList(basePath);
        await SqlFileManager.ensureCompleteData(viewConfigList);

        let {view} = await getViewToBeDroppedFromUser(viewConfigList);
        await dropView(view);

        process.exit(0);
    } catch (error) {
        if (!error.message.includes('user canceled')) {
            console.error(error);
        }

        process.exit(1);
    }
}



async function getViewToBeDroppedFromUser(viewConfigList) {
    let viewConfigFileList = viewConfigList.filter(({
                                                        type,
                                                        materialized
                                                    }) => type === 'view' && materialized !== true).map((viewConfig) => viewConfig.name);

    return await prompts([
        {
            type: 'select',
            name: 'view',
            message: 'which view do you want to drop?',
            choices: viewConfigFileList.sort().map((value) => {
                return {
                    title: value, value: value
                };
            })
        }
    ], {
        onCancel: () => {
            throw new Error('user canceled');
        }
    });
}



async function dropView(viewToBeDropped) {
    const db = await database;
    let query = `DROP VIEW IF EXISTS ${DATABASE_SCHEMA}.${viewToBeDropped} CASCADE`;
    return await db.query(query);
}