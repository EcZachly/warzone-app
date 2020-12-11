import {createEvent} from '../lib/model/events';
import useragent from 'useragent';

function isFileRequest(req) {
    const pieces = ['.png', '.js', '.jpg', '.css'];
    let isFileRequest = false;

    pieces.forEach((piece) => {
        if (req.url.includes(piece)) {
            isFileRequest = true;
        }
    });

    return isFileRequest;
}

/**
 * Logs all
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const createAPIEventMiddleware = async (req, res, next) => {
    const shouldBeLogged = req.url && !isFileRequest(req) && !req.headers.host.includes('localhost');
    const event = {
        url: req.url,
        referrer: req.headers.referer,
        query: JSON.stringify(req.query),
        user_agent: JSON.stringify(useragent.parse(req.headers['user-agent'])),
        headers: JSON.stringify(req.headers),
        host: req.headers.host,
        ip: req.connection.remoteAddress,
        event_time: new Date(),
        body: JSON.stringify(req.body)
    };

    if (shouldBeLogged) {
        await createEvent(event);
        next();
    } else {
        next();
    }
};
export default createAPIEventMiddleware;