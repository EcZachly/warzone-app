import {NextApiRequest, NextApiResponse} from 'next';
import {GAME_CATEGORIES} from '../../lib/constants';
import {getSquadDescriptionValues, querySquads} from '../../lib/model/squads';

//===---==--=-=--==---===----===---==--=-=--==---===----//
export async function findSquads(req: NextApiRequest, res: NextApiResponse) {
    const queryParams = req.query;
    const limit = req.query.limit || 10;
    delete queryParams.limit;
    const offset = req.query.offset || 0;
    delete queryParams.offset;

    const classDescriptionValues = await getSquadDescriptionValues({game_category: req.query.game_category || GAME_CATEGORIES.WARZONE});
    const squadList = await querySquads(queryParams, {limit, offset});

    res.json({
        squads: squadList,
        classDescriptions: classDescriptionValues
    });
}


export default {
    findSquads
};