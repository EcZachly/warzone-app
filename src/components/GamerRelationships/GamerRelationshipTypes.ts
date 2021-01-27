import {Metadata} from '../Metadata/MetadataTypes';
import {GamerPlatform, GamerUsername} from '../gamer/GamerTypes';
import {UserID} from '../Users/UserTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export type GamerRelationshipMetadata = Metadata & Record<any, unknown>;

export type RawGamerRelationship = {
    user_id: UserID,
    platform: GamerPlatform
    username: GamerUsername,
    type: 'self' | 'friend',
    is_favorite: boolean,
    metadata: GamerRelationshipMetadata | string,
    detailData?: Record<any, unknown>
};


export type RawGamerRelationshipList = RawGamerRelationship[];


export type GamerRelationship = RawGamerRelationship & {
    password: null,
    metadata: GamerRelationshipMetadata
};


export type GamerRelationshipList = GamerRelationship[];
