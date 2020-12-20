import {DAO} from './../Database';

import {VIEWS} from '../../constants';

import {GamerMatchList, RawGamerMatchList} from './GamerMatchTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export async function queryGamerMatches(query, options): Promise<GamerMatchList> {
    return DAO.find(VIEWS.GAMER_MATCHES_AUGMENTED, query, options);
}


export default {
    queryGamerMatches
};