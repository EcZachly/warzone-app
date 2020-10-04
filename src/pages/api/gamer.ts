import {NextApiRequest, NextApiResponse} from 'next'
import {initializeGamer, queryGamers} from "../../lib/model/gamers";
import {handleError, handleResponse} from "../../middleware/response_handler";
import {initializeMatches} from "../../lib/model/matches";
import {handleRecaptchaVerify} from "../../middleware/recaptcha_middleware";

//===---==--=-=--==---===----===---==--=-=--==---===----//
export default async function createGamer(req: NextApiRequest, res: NextApiResponse) {
    let newUser = req.body;
    let recaptcha = await handleRecaptchaVerify(newUser.token);
    let recaptchaSuccess = recaptcha.success;
    const {username, platform} = newUser;
    let error = null;
    if(!username){
        error = {userMessage: 'body.username (String) is required', status: 400}
    }
    if(!platform){
        error = {userMessage: 'body.platform (String) is required', status: 400}
    }
    if(!recaptchaSuccess){
        error = {userMessage: 'failed recaptcha verification', status: 400}
    }

    if(!error){
        let gamerObj = {
            username: username,
            platform: platform
        };

        let gamers = await queryGamers(gamerObj);
        let gamerExists = gamers.length > 0;

        let gamerUrl = ['gamer', gamerObj.platform, encodeURIComponent(gamerObj.username)].join('/');

        if (gamerExists) {
            handleResponse(req, res, {userMessage: 'gamer already exists!', url: gamerUrl, gamer: gamers[0]});
        } else {
            try {
                let initializedGamer = await initializeGamer(gamerObj);
                let matches = await initializeMatches(initializedGamer);
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
