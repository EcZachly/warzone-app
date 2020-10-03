import { NextApiRequest, NextApiResponse } from 'next'
import {queryView} from "../../model/analysis";
import {sanitizeGamer} from "../../model/gamers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    let viewName: string = 'player_stat_summary';
    let queryParams = req.query;
    let rawGamerList = await queryView(viewName, queryParams);
    let sanitizedGamers = rawGamerList.map(sanitizeGamer);
    res.json(sanitizedGamers);
}