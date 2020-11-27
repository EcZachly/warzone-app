import {DAO} from './../Database';

import {TABLES} from '../../constants';

import {GamerMatchList, RawGamerMatchList} from './GamerMatchTypes';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export async function queryGamerMatches(query, options): Promise<GamerMatchList> {
    return DAO.find(TABLES.GAMER_MATCHES, query, options);
}


export default {
    queryGamerMatches
};