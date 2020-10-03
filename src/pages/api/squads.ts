import { NextApiRequest, NextApiResponse } from 'next'
import {queryView} from "../../model/analysis";
import {sanitizeSquad} from "../../model/gamers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    let viewName: string = 'full_squad_stat_summary';
    let queryParams = req.query;
    let rawSquadList = await queryView(viewName, queryParams);
    let squadList = rawSquadList.map(sanitizeSquad);
    console.log(squadList);
    res.json(squadList);
}