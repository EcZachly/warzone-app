import {DAO} from './../Database';

import {VIEWS} from '../../constants';

import {GamerMatchList, RawGamerMatchList} from './GamerMatchTypes';
import {AnyObject} from '../Types';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//



export async function queryGamerMatches(query: AnyObject, options: AnyObject): Promise<GamerMatchList> {
    return DAO.find(VIEWS.GAMER_MATCHES_AUGMENTED, query, options);
}


export default {
    queryGamerMatches
};