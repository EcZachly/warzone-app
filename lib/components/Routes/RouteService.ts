import UtilityService from '../../../src/services/UtilityService';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export function sanitizeQueryParameters(query) {
    Object.keys(query).forEach((key) => {
        if (UtilityService.isJson(query[key])) {
            query[key] = JSON.parse(query[key]);
        }
    });

    return query;
}



export default {
    sanitizeQueryParameters
};