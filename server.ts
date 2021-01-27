import tracer from 'tracer';
const logger = tracer.colorConsole({format: '{{message}}'});

import express from 'express';
import path from 'path';

const server = express();


import {generateNextConfig} from './config/server/nextConfig';
import createAPIEventMiddleware from './routes/siteTrafficMiddlware';

import StaticFiles from './config/server/staticFiles';
import Security from './config/server/security';
import Tools from './config/server/tools';
import Setup from './config/server/setup';
// const FrontEndPageMap = require('./../src/page-map/');
import Routes from './routes';
import database from './lib/database';

const dev = (process.env.NODE_ENV !== 'production');
const CONSTANTS = {
    PAGES_DIRECTORY: path.join(__dirname), //this points to the location of our next.js app
    UNSECURED_PORT: 3000
};

const PORT = process.env.PORT || CONSTANTS.UNSECURED_PORT || 3000;

const app = generateNextConfig({
    dev,
    directory: CONSTANTS.PAGES_DIRECTORY,
    port: PORT as number
});

const handle = app.getRequestHandler();


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


async function run() {
    return new Promise(async (resolve, reject) => {
        app.prepare().then(async () => {
            Setup.checkForAllEnvironmentVariables();

            //this checks for a valid database connection
            try {
                const db = await database;
            } catch (error) {
                logger.warn('DATABASE CONNECTION ERROR');
                logger.warn(error);
            }

            Tools.configure(server);
            StaticFiles.include(server);
            // FrontEndPageMap.include(server, app);
            Security.configure(server);
            Routes.include(server);

            // server.use(function (err, req, res, next) {
            //
            // });

            server.use((req, res, next) => {
                const domains = {
                    'brshooter.com': true,
                    'www.brshooter.com': true
                };

                const hostname = domains[req.hostname] ? 'www.brshooter.com' : req.hostname;

                if (req.headers['x-forwarded-proto'] === 'http') {
                    res.redirect(301, `https://${hostname}${req.url}`);
                    return;
                }

                next();
            });
            server.use('*', (req, res, next) => createAPIEventMiddleware(req, res, next));

            server.get('*', (req, res) => {
                return handle(req, res);
            });

            server.listen(PORT, () => {
                // if (err) {
                //     throw err;
                // }

                resolve(server);

                logger.trace('Server Listening http://localhost:' + PORT);
            }).on('error', function (error) {
                logger.error(error);
                throw error;
            });

            // server.on('error', (error) => {
            //     logger.error(error);
            //     throw error;
            // });
        }).catch((ex) => {
            logger.error(ex.stack);
            process.exit(1);
        });
    });
}


function closeServer() {
    app.close();
}


module.exports = run();


module.exports.close = closeServer;