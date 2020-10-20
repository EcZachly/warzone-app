import {NextApiRequest, NextApiResponse} from 'next';


function handleResponse(req: NextApiRequest, res: NextApiResponse, data: Record<string, unknown>, options: Record<string, unknown> = {}) {
    res.status(200).json(data);
}


function handleError(req: NextApiRequest, res: NextApiResponse, data: Record<string, unknown>, status = 500, options: Record<string, unknown> = {}) {
    res.status(status).json(data);
}
export {handleResponse, handleError};