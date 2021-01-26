import {Metadata} from './MetadataTypes';
import randomstring from 'randomstring';
export function createNewMetadata(obj: Record<any, unknown> = {}): Metadata {
    const defaultMetadata = {
        create_timestamp: new Date()
    };

    return {...defaultMetadata, ...obj};
}



export default {
    createNewMetadata
};