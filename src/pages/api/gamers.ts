import { NextApiRequest, NextApiResponse } from 'next'
import {queryView} from "../../../lib/model/analysis";
import UtilityService from "../../../lib/services/UtilityService";


function sanitizeGamer(gamer) {
    gamer = UtilityService.validateItem(gamer, 'object', {});
    gamer.gulag_win_rate = (UtilityService.validateItem(gamer.gulag_win_rate, 'number', 0).toFixed(4) * 100).toFixed(2) + '%';
    gamer.kdr = (UtilityService.validateItem(gamer.kdr, 'number', 0).toFixed(4)).toString();
    gamer.aliases = UtilityService.validateItem(gamer.aliases, 'array', []);
    return gamer;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    let viewName: string = 'player_stat_summary';
    let queryParams = req.query;
    let rawGamerList = await queryView(viewName, queryParams);
    let sanitizedGamers = rawGamerList.map(sanitizeGamer);
    res.json(sanitizedGamers);
}