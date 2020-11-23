import tracer from 'tracer';
const logger = tracer.colorConsole({format: '{{message}}'});

const express = require('express');
const next = require('next');
const path = require('path');

let server = express();

const dev = (process.env.NODE_ENV !== 'production');
const CONSTANTS = {
    PAGES_DIRECTORY: path.join(__dirname), //this points to the location of our next.js app
    UNSECURED_PORT: 3000
};

const typescriptLoader = {
    test: /\.ts(x?)$/,
    use: 'ts-loader',
    exclude: /node_modules/
};

let PORT = process.env.PORT || CONSTANTS.UNSECURED_PORT || 3000;

const app = next({
    dev,
    dir: CONSTANTS.PAGES_DIRECTORY,
    conf: {
        pageExtensions: ['tsx', 'ts', 'js', 'jsx'],
        webpack: (config, options) => {
            config.module.rules.push(typescriptLoader);

            return config;
        },
        env: {
            WARZONE_DATABASE_URL: process.env.WARZONE_DATABASE_URL,
            WARZONE_EMAIL: process.env.WARZONE_EMAIL,
            WARZONE_PASSWORD: process.env.WARZONE_PASSWORD,
            WARZONE_RECAPTCHA_SITE_KEY: process.env.WARZONE_RECAPTCHA_SITE_KEY,
            WARZONE_RECAPTCHA_SECRET_KEY: process.env.WARZONE_RECAPTCHA_SECRET_KEY,
            PORT: PORT
        },
        api: {
            bodyParser: {
                sizeLimit: '500kb'
            }
        }
    }
});
const handle = app.getRequestHandler();

const StaticFiles = require('./config/server/staticFiles');
const Security = require('./config/server/security');
const Tools = require('./config/server/tools');
// const FrontEndPageMap = require('./../src/page-map/');
const Routes = require('./routes');


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


function run() {
    return new Promise((resolve, reject) => {
        app.prepare()
            .then(() => {
                Tools.configure(server);
                StaticFiles.include(server);
                // FrontEndPageMap.include(server, app);
                Security.configure(server);
                Routes.include(server);

                server.get('*', (req, res) => {
                    return handle(req, res);
                });

                server.listen(PORT, (err) => {
                    if (err) {
                        throw err;
                    }

                    resolve(server);

                    logger.trace('Server Listening http://localhost:' + PORT);
                });
            }).catch((ex) => {
            console.error(ex.stack);
            process.exit(1);
        });
    });
}


function closeServer() {
    app.close();
}


module.exports = run();


module.exports.close = closeServer;