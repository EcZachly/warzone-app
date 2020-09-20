import {ApiRequest, ApiResponse} from "../lib/middleware/request_object";

export function handleResponse(req: ApiRequest, res: ApiResponse, data) {
    req.endTime = new Date().getTime()
    let duration = req.endTime - req.startTime;
    console.log("request took " + duration + "ms");
    res.status(200).json(data);
}


export function handleRedirect(req: ApiRequest, res: ApiResponse, path:string) {
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