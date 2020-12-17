import {DAO} from './../Database';

import {TABLES, VIEWS} from '../../constants';

import {GamerRelationshipList} from './GamerRelationshipTypes';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

export async function queryGamerRelationships(query, options): Promise<GamerRelationshipList> {
    return DAO.find(TABLES.GAMER_RELATIONSHIPS, query, options);
}


export default {
    queryGamerRelationships
};