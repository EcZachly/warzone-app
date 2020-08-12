export function handleResponse(req, res, data){
    req.analysisEndTime = new Date();
    let duration  = req.analysisEndTime - req.analysisStartTime
    console.log("request took " + duration + "ms");
    res.status(200).json(data);
}