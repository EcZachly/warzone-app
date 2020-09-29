import {ApiRequest, ApiResponse, ApiRequestHandler} from "../../middleware/request_object";
import {initializeGamer, queryGamers} from "../../model/gamers";
import {initializeMatches} from "../../model/matches";
import {handleRedirect, handleError, handleResponse} from "../../../routes/response_handler";

//===---==--=-=--==---===----===---==--=-=--==---===----//


async function createGamer(req: ApiRequest, res: ApiResponse) {
    if (!req.recaptcha.error || req.hostname === 'localhost') {
        const {username, platform} = req.body;

        if (!username) {
            handleError(req, res, {message: 'body.username (String) is required'}, 400);
        } else if (!platform) {
            handleError(req, res, {message: 'body.platform (String) is required'}, 400);
        } else {
            let gamerObj = {
                username: req.body.username,
                platform: req.body.platform
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
    }
}
export {createGamer};



export default {
    createGamer: <ApiRequestHandler>createGamer
};