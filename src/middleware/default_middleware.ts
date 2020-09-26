
import SiteTrafficMiddleware from './site_traffic_middleware';

const defaultMiddleware = (handler) => async(req, res)=> {
    await SiteTrafficMiddleware(req, res);
    return handler(req, res);
}
export default defaultMiddleware;