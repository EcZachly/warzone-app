//Helper Libraries
import express from 'express';
import {Application} from 'express';
import compress from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';

//Environment variables
import process from '../environment';

//Middlewares
import analyticsMiddleware from '../lib/middleware/site_traffic_middleware';

//Routers
import api_router from '../routes/api_router';
import view_router from '../routes/view_router';

let PORT: number = process.env.PORT || 3000;
let app: Application = express();

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


run();

function run() {
    checkForRequiredEnvironmentVariables();

    app.use(helmet({
        contentSecurityPolicy: false
    }));

    app.use(compress());

    app.use(bodyParser.json({
        limit: '50mb'
    }));

    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    }));

    app.use(analyticsMiddleware);

    app.use(express.static('public'));

    app.set('view engine', 'ejs');

    app.set("views", "views")

    app.use(view_router);

    app.use('/api', api_router)


    app.get('/', (req, res) => {
        res.redirect('/gamers');
    });

    app.listen(PORT, () => console.log('listening on port:' + PORT));
}


function checkForRequiredEnvironmentVariables() {
    const requiredEnvironmentVariables = [
        'WARZONE_RECAPTCHA_SITE_KEY',
        'WARZONE_RECAPTCHA_SECRET_KEY',
        'WARZONE_DATABASE_URL',
        'WARZONE_EMAIL',
        'WARZONE_PASSWORD',
    ];

    const missingEnvironmentVariables = requiredEnvironmentVariables.filter((key) => !process.env[key]);

    if (missingEnvironmentVariables.length > 0) {
        throw new Error('The following environment variables are missing and required: ' + JSON.stringify(missingEnvironmentVariables));
    }
}