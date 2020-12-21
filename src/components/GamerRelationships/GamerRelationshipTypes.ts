import {Metadata} from '../Metadata/MetadataTypes';
import {GamerPlatform, GamerUsername} from '../gamer/GamerTypes';
import {UserID} from '../Users/UserTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export type GamerRelationshipMetadata = Metadata & {}

export type RawGamerRelationship = {
    user_id: UserID,
    platform: GamerPlatform
    username: GamerUsername,
    type: 'self' | 'friend',
    is_favorite: boolean,
    metadata: GamerRelationshipMetadata | String,
    detailData?: object
};


export type RawGamerRelationshipList = RawGamerRelationship[];


export type GamerRelationship = RawGamerRelationship & {
    password: null,
    metadata: GamerRelationshipMetadata
};


export type GamerRelationshipList = GamerRelationship[];
