import {ApiRequest, ApiResponse} from "../lib/middleware/request_object";


export function handleResponse(req: ApiRequest, res: ApiResponse, data, options?: {}) {
    logTime(req);
    res.status(200).json(data);
}


export function handleError(req: ApiRequest, res: ApiResponse, data, status, options?: {}) {
    logTime(req);
    res.status(status || 500).json(data);
}


export function handleRedirect(req: ApiRequest, res: ApiResponse, path: string) {
    req.endTime = new Date().getTime()
    let duration = req.endTime - req.startTime;
    console.log("request took " + duration + "ms");
    res.redirect(path)
}

export function handleRender(req: ApiRequest, res: ApiResponse, path: string, data) {
    req.endTime = new Date().getTime()
    let duration = req.endTime - req.startTime;
    console.log("request took " + duration + "ms");
    res.render(path, data);
}


function logTime(req: ApiRequest) {
    req.endTime = new Date().getTime();
    let duration = req.endTime - req.startTime;
    console.log("request took " + duration + "ms");
}