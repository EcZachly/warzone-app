import {queryDatabase} from '../../database_utils';

import {TABLES} from '../../constants';

import {MatchList, RawMatchList} from './MatchTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export async function queryMatches(query, options): Promise<MatchList> {
    return queryDatabase(TABLES.MATCHES, query, options);
}


export default {
    queryMatches
};