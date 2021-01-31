import SiteTrafficMiddleware from './siteTrafficMiddlware';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

const defaultMiddleware = async(req, res, next)=> {
    await SiteTrafficMiddleware(req, res, next);
};
export default defaultMiddleware;