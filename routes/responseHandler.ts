import {Request, Response} from 'express';
import {DEFAULT_ERROR_MESSAGE} from '../src/config/CONSTANTS';

type ValidResponse = Record<any, unknown> | any[] | string | number | null;

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export function handleResponse(req: Request, res: Response, data: ValidResponse) {
    res.status(200).json(data);
}


export function handleError(req: Request, res: Response, data: ValidResponse = {message: DEFAULT_ERROR_MESSAGE}, status = 500) {
    if (status === 204) {
        data = '';
    }

    res.status(status).json(data);
}


export default {
    handleResponse,
    handleError
};