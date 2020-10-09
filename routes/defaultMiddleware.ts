import SiteTrafficMiddleware from './siteTrafficMiddlware';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



const defaultMiddleware = (handler) => async(req, res)=> {
    await SiteTrafficMiddleware(req, res);
    return handler(req, res);
};
export default defaultMiddleware;