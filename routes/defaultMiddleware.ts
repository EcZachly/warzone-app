import SiteTrafficMiddleware from './siteTrafficMiddlware';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



const defaultMiddleware = (handler) => async(req, res, next)=> {
    await SiteTrafficMiddleware(req, res, next);
    return handler(req, res);
};
export default defaultMiddleware;