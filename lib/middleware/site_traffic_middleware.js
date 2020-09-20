import {createEvent} from '../model/events';
import * as useragent from 'useragent';
import {NextFunction} from 'express';
import {ApiResponse, ApiRequest} from "./request_object";

function isFileRequest(req){
    let pieces = ['.png', '.js', '.jpg', '.css'];
    let isFileRequest = false;
    pieces.forEach((piece)=>{
        if(req.url.includes(piece)){
            isFileRequest = true;
        }
    });
    return isFileRequest
}

/**
 * Logs all
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export default async function createAPIEventMiddleware (req, res, next){
    let shouldBeLogged = req.url && !isFileRequest(req) && !req.hostname.includes('localhost');
    let event = {
        url: req.url,
        referrer: req.headers.referer,
        query: JSON.stringify(req.query),
        user_agent: JSON.stringify(useragent.parse(req.headers['user-agent'])),
        headers: JSON.stringify(req.headers),
        host: req.headers.host,
        ip: req.connection.remoteAddress,
        event_time: new Date()
    };

    if(shouldBeLogged){
        await createEvent(event);
        next();
    }
    else{
        next();
    }
}