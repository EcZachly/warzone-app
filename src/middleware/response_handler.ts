import {NextApiRequest, NextApiResponse} from "next";


function handleResponse(req: NextApiRequest, res: NextApiResponse, data, options?: {}) {
    res.status(200).json(data);
}


function handleError(req: NextApiRequest, res: NextApiResponse, data, status, options?: {}) {
    res.status(status || 500).json(data);
}
export {handleResponse, handleError}