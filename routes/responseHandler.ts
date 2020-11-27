import {NextApiRequest, NextApiResponse} from 'next';

type ValidResponse = Record<any, unknown> | any[] | string | number;

export function handleResponse(req: NextApiRequest, res: NextApiResponse, data: ValidResponse, options: Record<string, unknown> = {}) {
    res.status(200).json(data);
}


export function handleError(req: NextApiRequest, res: NextApiResponse, data: ValidResponse, status = 500, options: Record<string, unknown> = {}) {
    if (status === 204) {
        data = '';
    }

    res.status(status).json(data);
}


export default {
    handleResponse,
    handleError
};