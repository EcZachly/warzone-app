import {Request, Response, RequestHandler} from "express"

export interface ApiRequest extends Request {
    startTime: number;
    endTime: number;
}


export interface ApiResponse extends Response {
}


export interface ApiRequestHandler extends RequestHandler {
}