import {Metadata} from './MetadataTypes';



export function createNewMetadata(obj: Record<any, unknown> = {}): Metadata {
    let defaultMetadata = {
        create_timestamp: new Date()
    };

    return {...defaultMetadata, ...obj};
}



export default {
    createNewMetadata
};