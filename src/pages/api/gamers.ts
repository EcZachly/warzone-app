import { NextApiRequest, NextApiResponse } from 'next'
import {queryView} from "../../lib/model/analysis";
import {sanitizeGamer} from "../../lib/model/gamers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    let viewName: string = 'player_stat_summary';
    let queryParams = req.query;
    let offset = req.query.offset || 0;
    let limit = req.query.limit || 10;
    delete queryParams.offset;
    delete queryParams.limit;
    let rawGamerList = await queryView(viewName, queryParams, {offset, limit});
    console.log(rawGamerList);
    let sanitizedGamers = rawGamerList.map(sanitizeGamer);
    res.json(sanitizedGamers);
}