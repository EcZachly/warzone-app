import {DAO} from './../Database';

import {TABLES} from '../../constants';

import {GamerRelationshipList, RawGamerRelationship} from './GamerRelationshipTypes';
import {MetadataService} from '../../../src/components/Metadata';
import {AnyObject} from '../Types';


//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

export async function queryGamerRelationships(query: Partial<RawGamerRelationship>, options: AnyObject): Promise<GamerRelationshipList> {
    return DAO.find(TABLES.GAMER_RELATIONSHIPS, query, options);
}

export async function removeGamerRelationship(query: Partial<RawGamerRelationship>): Promise<void> {
    return DAO.destroy(TABLES.GAMER_RELATIONSHIPS, query);
}



export async function createGamerRelationship(gamerRelationship: Partial<RawGamerRelationship>): Promise<RawGamerRelationship> {
    if (!gamerRelationship.metadata) {
        gamerRelationship.metadata = MetadataService.createNewMetadata();
    }

    return DAO.insert(TABLES.GAMER_RELATIONSHIPS, gamerRelationship);
}


export default {
    queryGamerRelationships,
    createGamerRelationship,
    removeGamerRelationship
};