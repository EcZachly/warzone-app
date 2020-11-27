import {queryDatabase} from '../../etl/utils';

import {VIEWS} from '../../constants';

import {MatchList, RawMatchList} from './MatchTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export async function queryMatches(query, options): Promise<MatchList> {
    return queryDatabase(VIEWS.MATCHES_AUGMENTED, query, options);
}


export default {
    queryMatches
};