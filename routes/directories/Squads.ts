import {NextApiRequest, NextApiResponse} from 'next';

import {queryView} from '../../lib/model/analysis';

import SquadService from '../../lib/components/Squads/SquadService';

//===---==--=-=--==---===----===---==--=-=--==---===----//


export async function findSquads(req: NextApiRequest, res: NextApiResponse) {
    const viewName = 'full_squad_stat_summary';
    const classDescriptions = 'squad_class_description_values';

    const queryParams = req.query;

    const limit = req.query.limit || 10;
    delete queryParams.limit;

    const offset = req.query.offset || 0;
    delete queryParams.offset;

    const classDescriptionValues = await queryView(classDescriptions, {}, {});

    const rawSquadList = await queryView(viewName, queryParams, {limit, offset});

    const squadList = rawSquadList.map(SquadService.sanitizeSquad);

    res.json({
        squads: squadList,
        classDescriptions: classDescriptionValues
    });
}


export default {
    findSquads
};