import {NextApiRequest, NextApiResponse} from 'next';
import {initializeGamer, queryGamers} from '../../lib/model/gamers';
import {handleError, handleResponse} from '../../middleware/response_handler';
import {initializeMatches} from '../../lib/model/matches';
import {handleRecaptchaVerify} from '../../middleware/recaptcha_middleware';

//===---==--=-=--==---===----===---==--=-=--==---===----//
export default async function createGamer(req: NextApiRequest, res: NextApiResponse) {
    const newUser = req.body;
    const recaptcha = await handleRecaptchaVerify(newUser.token);
    const recaptchaSuccess = recaptcha.success;
    const {username, platform} = newUser;
    let error = null;
    if(!username){
        error = {userMessage: 'body.username (String) is required', status: 400};
    }
    if(!platform){
        error = {userMessage: 'body.platform (String) is required', status: 400};
    }
    if(!recaptchaSuccess){
        error = {userMessage: 'failed recaptcha verification', status: 400};
    }

    if(!error){
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
    }
    else{
        handleError(req, res, {message: error.message}, error.status);
    }
}
