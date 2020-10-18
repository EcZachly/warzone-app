import { NextApiRequest, NextApiResponse } from 'next';
import {queryView} from '../../lib/model/analysis';
import {sanitizeGamer} from '../../lib/model/gamers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const viewName = 'player_stat_summary';
    const queryParams = req.query;
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    delete queryParams.offset;
    delete queryParams.limit;
    const rawGamerList = await queryView(viewName, queryParams, {offset, limit});
    const sanitizedGamers = rawGamerList.map(sanitizeGamer);
    res.json(sanitizedGamers);
};