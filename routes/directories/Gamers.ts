import {NextApiRequest, NextApiResponse} from 'next';
import Bluebird from 'bluebird';

import {initializeGamer, updateGamer, queryGamers, sanitizeGamer, sanitizeTeammates} from '../../lib/model/gamers';
import {getQueryParamToSQLMap} from '../../lib/components/Utils';
import {initializeMatches} from '../../lib/model/matches';

import {handleError, handleResponse} from '../responseHandler';
import DefaultMiddleware from '../defaultMiddleware';
import {handleRecaptchaVerify} from '../recaptchaMiddleware';

import {VIEWS} from '../../lib/constants';
import {
    getGamerClassDescriptions,
    getGamerDetailViewQuery,
    getSingleGamerData
} from '../../lib/components/Gamers/GamerService';

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
    const queryParams = req.query;

    const offset = queryParams.offset || 0;
    delete queryParams.offset;

    const limit = queryParams.limit || 10;
    delete queryParams.limit;

    const sort = queryParams.sort || null;
    delete queryParams.sort;

    const sortDirection = queryParams.direction || null;
    delete queryParams.direction;

    manageComplexQueryParameters(queryParams);
    let classDescriptions = await getGamerClassDescriptions();
    let queryOptions = {offset, limit, order: undefined};
    if (sort) {
        let sortObj = {
            field: sort,
            direction: undefined
        };

        if (sortDirection) {
            sortObj.direction = sortDirection;
        }

        queryOptions.order = [sortObj];
    }

    let playerQuery = getGamerDetailViewQuery(VIEWS.PLAYER_STAT_SUMMARY, queryParams, queryOptions);
    await playerQuery.executeQuery();
    let gamers = playerQuery.data;
    handleResponse(req, res, {gamers, classDescriptions});
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
    let allParams = {...req.params, ...req.query};

    let paramMap = getQueryParamToSQLMap()
    let errorObject = {
        'missing_data': 'platform and username (/gamers/:platform/:username, String) are required and cannot be empty',
        'invalid_view': 'invalid view query param needs to be in ' + Object.keys(paramMap).join(','),
        'not_found': username + ' on platform: ' + platform + ' was not found!'
    }
    if (!platform || !username) {
       return handleError(req, res, {message: errorObject['missing_data']});
    }
    const sqlView = paramMap[view as string];
    if(!sqlView){
        return handleError(req, res, {message: errorObject['invalid_view']});
    }

    const viewToQuery = getGamerDetailViewQuery(sqlView, allParams)
    const gamer = await getSingleGamerData(username, platform)
    const classDescriptions = await getGamerClassDescriptions()

    if (!gamer) {
       return handleError(req, res, {message: errorObject['not_found']});
    }

    await viewToQuery.executeQuery();
    const viewData = viewToQuery.data;
    await updateGamerUponRequest({username, gamer});
    const seoMetadata = {
        title: 'Warzone stats for ' + gamer['username'],
        keywords: ['warzone', 'stats', 'kdr', 'gulag wins'],
        description: 'KDR: ' + gamer['kdr'] + ' Gulag Win Rate: ' + gamer['gulag_win_rate']
    };
    handleResponse(req, res, {
        gamer,
        viewData,
        seoMetadata,
        classDescriptions
    });
}


export default {
    createGamer,
    findGamers,
    getGamerDetails: DefaultMiddleware(getGamerDetails)
};