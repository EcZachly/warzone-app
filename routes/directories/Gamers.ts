import {Request, Response} from 'express';

import tracer from 'tracer';
const logger = tracer.colorConsole();
import Bluebird from 'bluebird';

import {initializeGamer, updateGamer, queryGamers} from '../../lib/model/gamers';
import {getQueryParamToSQLMap} from '../../lib/components/Utils';
import {initializeMatches} from '../../lib/model/matches';

import {handleError, handleResponse} from '../responseHandler';
import DefaultMiddleware from '../defaultMiddleware';
import {handleRecaptchaVerify} from '../recaptchaMiddleware';

import {GAME_CATEGORIES, VIEWS} from '../../lib/constants';
import {
    getGamerClassDescriptions,
    getGamerDetailViewQuery,
    getSingleGamerData
} from '../../lib/components/Gamers/GamerService';
import {Gamer, GamerPlatform} from '../../src/components/gamer/GamerTypes';
import {ViewQuery} from '../../lib/model/view_query';
import {GamerClassDescription} from '../../lib/components/Classes/ClassDescriptionType';
import UtilityService from '../../src/services/UtilityService';
import {DEFAULT_ERROR_MESSAGE} from '../../src/config/CONSTANTS';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export async function createGamer(req: Request, res: Response) {
    const newUser = req.body;
    const recaptcha = await handleRecaptchaVerify(newUser.token);
    const recaptchaSuccess = recaptcha.success;
    const {username, platform} = newUser;
    let error = null;

    const errorObject = {
        'missing_data': {message: 'body.username and body.platform (String) are required', status: 400},
        'recaptcha_fail': {message: 'failed recaptcha verification', status: 400}
    };

    if (!username || !platform) {
        error = errorObject['missing_data'];
    }

    if (!recaptchaSuccess) {
        error = errorObject['recaptcha_fail'];
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
            const column = key.split('.')[0];
            const operator = key.split('.')[1];
            queryParams[column + ' ' + operator] = queryParams[key];
            delete queryParams[key];
        } else if (UtilityService.isJson(queryParams[key])) {
            queryParams[key] = JSON.parse(queryParams[key]);
        }
    });
}


export async function findGamers(req: Request, res: Response) {
    const queryParams = req.query;

    const offset = queryParams.offset || 0;
    delete queryParams.offset;

    const limit = queryParams.limit || 10;
    delete queryParams.limit;

    const sort = queryParams.sort || null;
    delete queryParams.sort;

    const sortDirection = queryParams.direction || null;
    delete queryParams.direction;


    if (!queryParams['game_category']) {
        queryParams['game_category'] = GAME_CATEGORIES.WARZONE;
    }

    manageComplexQueryParameters(queryParams);
    const classDescriptions: GamerClassDescription = await getGamerClassDescriptions();
    const queryOptions = {offset, limit, order: undefined};

    if (sort) {
        const sortObj = {
            field: sort,
            direction: undefined
        };

        if (sortDirection) {
            sortObj.direction = sortDirection;
        }

        queryOptions.order = [sortObj];
    }

    const playerQuery = getGamerDetailViewQuery(VIEWS.GAMER_STAT_SUMMARY, queryParams, queryOptions);

    await playerQuery.executeQuery();
    const gamers = playerQuery.data;

    handleResponse(req, res, {gamers, classDescriptions});
}


async function updateGamerUponRequest(gamer: Gamer): Promise<Gamer> {
    let gamerPromise = Bluebird.resolve(gamer);

    if (!gamer.needs_update) {
        gamer.needs_update = true;
        gamerPromise = updateGamer({username: gamer.username, platform: gamer.platform}, gamer) as Bluebird<Gamer>;
    }

    return await gamerPromise;
}


export async function getGamerDetails(req: Request & { params: { username: string, platform: string } }, res: Response) {
    logger.trace('getGamerDetails');

    const {view, game_category} = req.query;
    delete req.query.view;

    const {username, platform} = req.params;

    const allParams = {...req.params, ...req.query};

    const paramMap = getQueryParamToSQLMap();

    const errorObject = {
        'missing_data': 'platform and username (/gamers/:platform/:username, String) are required and cannot be empty',
        'invalid_view': 'invalid view query param needs to be in ' + Object.keys(paramMap).join(','),
        'not_found': username + ' on platform: ' + platform + ' was not found!'
    };


    if (!platform || !username) {
        return handleError(req, res, {message: errorObject['missing_data']});
    }

    const sqlView = paramMap[view as string];

    if (!sqlView) {
        return handleError(req, res, {message: errorObject['invalid_view']});
    }

    try {
        const gamer = await getSingleGamerData(username, platform as GamerPlatform, game_category as string);

        if (!gamer) {
            return handleError(req, res, {message: errorObject['not_found']});
        }

        const queryParams = {...allParams, uno_id: gamer.uno_id};

        const viewToQuery = getGamerDetailViewQuery(sqlView, queryParams);

        await viewToQuery.executeQuery();
        const viewData = viewToQuery.data;

        const classDescriptions = await getGamerClassDescriptions();

        await updateGamerUponRequest(gamer);

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

    } catch (error) {
        logger.error(error);
        return handleError(req, res, {message: DEFAULT_ERROR_MESSAGE});
    }



}


export default {
    createGamer,
    findGamers,
    getGamerDetails: DefaultMiddleware(getGamerDetails)
};