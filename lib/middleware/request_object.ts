import { Request, Response} from "express"

export interface ApiRequest extends Request
{
    startTime: number;
    endTime: number;
}


export interface ApiResponse extends Response
{}
