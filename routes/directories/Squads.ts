import {NextApiRequest, NextApiResponse} from 'next';
import {queryView} from '../../lib/model/analysis';
import {sanitizeSquad} from '../../lib/model/gamers';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export async function findSquads(req: NextApiRequest, res: NextApiResponse) {
    const viewName = 'full_squad_stat_summary';
    const classDescriptions = 'squad_class_description_values';
    const queryParams = req.query;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    delete queryParams.limit;
    delete queryParams.offset;
    const classDescriptionValues = await queryView(classDescriptions, {}, {});
    const rawSquadList = await queryView(viewName, queryParams, {limit, offset});
    const squadList = rawSquadList.map(sanitizeSquad);
    res.json({
        squads: squadList,
        classDescriptions: classDescriptionValues
    });
}


export default {
    findSquads
};