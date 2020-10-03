import {createEvent} from '../model/events';
import useragent from 'useragent';

function isFileRequest(req) {
    let pieces = ['.png', '.js', '.jpg', '.css'];
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
const createAPIEventMiddleware = async (req, res) => {
    let shouldBeLogged = req.url && !isFileRequest(req) && !req.headers.host.includes('localhost');
    let event = {
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
        return await createEvent(event);
    } else {
        return;
    }
}
export default createAPIEventMiddleware;