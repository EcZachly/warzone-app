import {NextApiRequest, NextApiResponse} from 'next';
import {DEFAULT_ERROR_MESSAGE} from '../src/config/CONSTANTS';

type ValidResponse = Record<any, unknown> | any[] | string | number | null;

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export function handleResponse(req: NextApiRequest, res: NextApiResponse, data: ValidResponse) {
    res.status(200).json(data);
}


export function handleError(req: NextApiRequest, res: NextApiResponse, data: ValidResponse = {message: DEFAULT_ERROR_MESSAGE}, status = 500) {
    if (status === 204) {
        data = '';
    }

    res.status(status).json(data);
}


export default {
    handleResponse,
    handleError
};