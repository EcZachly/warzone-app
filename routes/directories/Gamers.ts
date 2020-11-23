import {NextApiRequest, NextApiResponse} from 'next';
import Bluebird from 'bluebird';

import {initializeGamer, updateGamer, queryGamers, sanitizeGamer, sanitizeSquad, sanitizeTeammates} from '../../lib/model/gamers';
import {queryView} from '../../lib/model/analysis';
import {ViewQuery} from '../../lib/model/view_query';
import {initializeMatches} from '../../lib/model/matches';

import {handleError, handleResponse} from '../responseHandler';
import DefaultMiddleware from '../defaultMiddleware';
import {handleRecaptchaVerify} from '../recaptchaMiddleware';

//===---==--=-=--==---===----===---==--=-=--==---===----//



export async function createGamer(req: NextApiRequest, res: NextApiResponse) {
    const newUser = req.body;
    const recaptcha = await handleRecaptchaVerify(newUser.token);
    const recaptchaSuccess = recaptcha.success;
    const {username, platform} = newUser;
    let error = null;

    if (!username) {
        error = {userMessage: 'body.username (String) is required', status: 400};
    }

    if (!platform) {
        error = {userMessage: 'body.platform (String) is required', status: 400};
    }

    if (!recaptchaSuccess) {
        error = {userMessage: 'failed recaptcha verification', status: 400};
    }

    if (!error) {
        const gamerObj = {
            username: username,
            platform: platform
        };

        const gamers = await queryGamers(gamerObj);
        const gamerExists = gamers.length > 0;

        const gamerUrl = ['gamer', gamerObj.platform, encodeURIComponent(gamerObj.username)].join('/');

        if (gamerExists) {
            handleResponse(req, res, {userMessage: 'gamer already exists!', url: gamerUrl, gamer: gamers[0]});
        } else {
            try {
                const initializedGamer = await initializeGamer(gamerObj);
                const matches = await initializeMatches(initializedGamer);
                handleResponse(req, res, {
                    userMessage: 'gamer successfully added!',
                    url: gamerUrl,
                    gamer: initializedGamer,
                    matches: matches
                });
            } catch (e) {
                handleError(req, res, {userMessage: 'gamer not found'}, 400);
            }
        }
    } else {
        handleError(req, res, {message: error.message}, error.status);
    }
}


/**
 * This function translates REST friendly parameters like
 * username.ilike into massiveJS friendly querying
 * @param queryParams -- the query parameters that you are trying to pass
 */
function manageComplexQueryParameters(queryParams){
    Object.keys(queryParams).forEach((key)=>{
        if(key.includes('.')){
            let column = key.split('.')[0];
            let operator = key.split('.')[1];
            queryParams[column + ' ' + operator] =  queryParams[key];
            delete queryParams[key];
        }
    });
}

export async function findGamers(req: NextApiRequest, res: NextApiResponse) {
    const viewName = 'player_stat_summary';
    const descriptionConfig = 'gamer_class_description_values';
    const queryParams = req.query;
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    delete queryParams.offset;
    delete queryParams.limit;
    manageComplexQueryParameters(queryParams);

    const descriptionData = await queryView(descriptionConfig, {}, {});
    const rawGamerList = await queryView(viewName, queryParams, {offset, limit});
    const sanitizedGamers = rawGamerList.map(sanitizeGamer);

    handleResponse(req, res, {'gamers': sanitizedGamers, 'classDescriptions': descriptionData[0]});
}



const TEAMMATE_FILTER_KEYS = ['username', 'platform', 'aliases'];

async function updateGamerUponRequest(gamerData) {
    let gamerPromise = Bluebird.resolve(gamerData);

    if (!gamerData.needs_update) {
        gamerData.needs_update = true;
        gamerPromise = updateGamer({username: gamerData.username, platform: gamerData.platform}, gamerData);
    }

    return await gamerPromise;
}


export async function getGamerDetails(req: NextApiRequest & { params: { username: string, platform: string } }, res: NextApiResponse) {
    const {view, timeZone} = req.query;
    const {username, platform} = req.params;

    if (!platform) {
        handleError(req, res, {message: 'platform (/gamers/:platform/:username, String) is required and cannot be empty'});
    } else if (!username) {
        handleError(req, res, {message: 'username (/gamers/:platform/:username, String) is required and cannot be empty'});
    } else {
        const viewMap = {
            'teammates': 'teammate_analysis',
            'placements': 'gamer_stats_graded',
            'stats': 'gamer_stats_graded',
            'time': 'time_analysis',
            'squads': 'full_squad_stat_summary',
            'trends': 'trend_analysis'
        };

        const sqlView = viewMap[view as string];

        const userQuery = {
            username: username,
            platform: platform
        };
        const userString = '%' + platform + '-' + username + '%';
        const squadQuery = {'team_grain LIKE': userString}


        const timezoneQuery = {
            timezone: timeZone || 'America/Los_Angeles',
            cutoff: '10'
        };

        const trendQuery = {
            lookback: 30
        };

        const queryableViews = [
            new ViewQuery('player_stat_summary', userQuery),
            new ViewQuery('gamer_class_description_values', {}),
            new ViewQuery('gamer_stats_graded', userQuery),
            new ViewQuery('teammate_analysis', userQuery),
            new ViewQuery('time_analysis', {...userQuery, ...timezoneQuery}),
            new ViewQuery('full_squad_stat_summary', squadQuery),
            new ViewQuery('trend_analysis', {...userQuery, ...trendQuery}),
        ];

        const viewNamesToQuery = ['player_stat_summary', 'gamer_class_description_values', sqlView as string];
        const viewsToQuery = queryableViews.filter((v: ViewQuery) => viewNamesToQuery.includes(v.view));

        const gamerList = await queryGamers({username: username, platform: platform});
        const gamerData = gamerList[0];
        const gamerExists = !!gamerData;

        if (gamerExists) {
            const gamerMatchDataPromises = viewsToQuery.map(async (view: ViewQuery) => await view.executeQuery());

            Bluebird.all(gamerMatchDataPromises).then(async () => {
                const gamer =  sanitizeGamer(viewsToQuery[0].data[0]);
                const gamerClassDescriptions = viewsToQuery[1].data[0];
                let viewData = viewsToQuery[2].data as Array<object>;

                const sanitizationLookup = {
                    'gamer_stats_graded': () => viewData,
                    'time_analysis': () => viewData,
                    'teammate_analysis': () => sanitizeTeammates(viewData, TEAMMATE_FILTER_KEYS),
                    'full_squad_stat_summary': () => viewData.map(sanitizeSquad),
                    'trend_analysis': ()=> viewData
                };

                viewData = sanitizationLookup[sqlView]();

                await updateGamerUponRequest(gamerData);

                const seoMetadata = {
                    title: 'Warzone stats for ' + gamer.username,
                    keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
                    description: 'KDR: ' + gamer.kdr + ' Gulag Win Rate: ' + gamer.gulag_win_rate
                };

                handleResponse(req, res, {
                    gamer: gamer,
                    viewData: viewData,
                    seoMetadata: seoMetadata,
                    classDescriptions: gamerClassDescriptions,
                });
            });
        } else {
            handleError(req, res, {
                errorMessage: username + ' on platform: ' + platform + ' was not found!'
            });
        }
    }
}



export default {
    createGamer,
    findGamers,
    getGamerDetails: DefaultMiddleware(getGamerDetails)
};