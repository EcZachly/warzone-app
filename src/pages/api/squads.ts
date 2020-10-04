import { NextApiRequest, NextApiResponse } from 'next'
import {queryView} from "../../lib/model/analysis";
import {sanitizeSquad} from "../../lib/model/gamers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    let viewName: string = 'full_squad_stat_summary';
    let queryParams = req.query;
    let limit = req.query.limit || 10;
    let offset = req.query.offset || 0;
    delete queryParams.limit;
    delete queryParams.offset;
    let rawSquadList = await queryView(viewName, queryParams, {limit, offset});
    console.log(rawSquadList);
    let squadList = rawSquadList.map(sanitizeSquad);
    res.json(squadList);
}