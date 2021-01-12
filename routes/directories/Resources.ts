import {NextApiRequest, NextApiResponse} from "next";
import {queryResources} from "../../lib/model/resources";

export async function findResources(req: NextApiRequest, res: NextApiResponse){
    console.log(req.query);
    let query = req.query || {};
    let data =  await queryResources(query);
    res.json(data);
}


export default {
    findResources
}