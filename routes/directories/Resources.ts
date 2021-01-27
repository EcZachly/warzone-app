import {Request, Response} from 'express';
import {queryResources} from '../../lib/model/resources';

//===---==--=-=--==---===----===---==--=-=--==---===----//



export async function findResources(req: Request, res: Response) {
    console.log(req.query);

    const query = req.query || {};
    const data = await queryResources(query);

    res.json(data);
}



export default {
    findResources
};