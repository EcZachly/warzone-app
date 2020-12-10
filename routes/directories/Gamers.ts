import {NextApiRequest, NextApiResponse} from 'next';
import Bluebird from 'bluebird';

import {initializeGamer, updateGamer, queryGamers, sanitizeGamer, sanitizeTeammates} from '../../lib/model/gamers';
import {restKeyToSQLView, restToMassiveQuery} from '../../lib/components/Utils';
import {queryView} from '../../lib/model/analysis';
import {initializeMatches} from '../../lib/model/matches';

import {handleError, handleResponse} from '../responseHandler';
import DefaultMiddleware from '../defaultMiddleware';
import {handleRecaptchaVerify} from '../recaptchaMiddleware';

import {VIEWS} from './../../lib/constants';
import {getGamerDetailViewQuery} from "../../lib/components/Gamers/GamerService";

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
function manageComplexQueryParameters(queryParams) {
    Object.keys(queryParams).forEach((key) => {
        if (key.includes('.')) {
            let column = key.split('.')[0];
            let operator = key.split('.')[1];
            queryParams[column + ' ' + operator] = queryParams[key];
            delete queryParams[key];
        }
    });
}

export async function findGamers(req: NextApiRequest, res: NextApiResponse) {
    const viewName = VIEWS.PLAYER_STAT_SUMMARY;
    const descriptionConfig = VIEWS.GAMER_CLASS_DESCRIPTIONS;
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





async function updateGamerUponRequest(gamerData) {
    let gamerPromise = Bluebird.resolve(gamerData);

    if (!gamerData.needs_update) {
        gamerData.needs_update = true;
        gamerPromise = updateGamer({username: gamerData.username, platform: gamerData.platform}, gamerData);
    }

    return await gamerPromise;
}


export async function getGamerDetails(req: NextApiRequest & { params: { username: string, platform: string } }, res: NextApiResponse) {
    const {view} = req.query;
    delete req.query.view;
    const {username, platform} = req.params;
    let allParams = {...req.params, ...req.query}
    if (!platform) {
        handleError(req, res, {message: 'platform (/gamers/:platform/:username, String) is required and cannot be empty'});
    } else if (!username) {
        handleError(req, res, {message: 'username (/gamers/:platform/:username, String) is required and cannot be empty'});
    } else {
        const sqlView = restKeyToSQLView(view as string)
        const viewsToQuery = {
            [VIEWS.PLAYER_STAT_SUMMARY]:   getGamerDetailViewQuery(VIEWS.PLAYER_STAT_SUMMARY, allParams),
            [VIEWS.GAMER_CLASS_DESCRIPTIONS]:  getGamerDetailViewQuery(VIEWS.GAMER_CLASS_DESCRIPTIONS, allParams),
            [sqlView]:  getGamerDetailViewQuery(sqlView, allParams)
        }
        const gamerList = await queryGamers({username, platform});
        const gamerData = gamerList[0];
        const gamerExists = !!gamerData;
        if (gamerExists) {
            const gamerMatchDataPromises = Object.keys(viewsToQuery).map(async (key: string) => await viewsToQuery[key].executeQuery());
            Bluebird.all(gamerMatchDataPromises).then(async () => {
                const gamer = viewsToQuery[VIEWS.PLAYER_STAT_SUMMARY].data[0];
                const gamerClassDescriptions = viewsToQuery[VIEWS.GAMER_CLASS_DESCRIPTIONS].data[0];
                const viewData = viewsToQuery[sqlView].data;
                await updateGamerUponRequest(gamerData);
                const seoMetadata = {
                    title: 'Warzone stats for ' + gamer['username'],
                    keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
                    description: 'KDR: ' + gamer['kdr'] + ' Gulag Win Rate: ' + gamer['gulag_win_rate']
                };
                handleResponse(req, res, {
                    gamer: gamer,
                    viewData: viewData,
                    seoMetadata: seoMetadata,
                    classDescriptions: gamerClassDescriptions
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