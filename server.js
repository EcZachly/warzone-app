import express from 'express';
import helmet from 'helmet';
import {queryGamers} from "./lib/model/gamer";

let app = express()
app.use(helmet());
let PORT = process.env.PORT || 3000;

app.get('/api/gamers', (req, res)=>{
    queryGamers(req.query).then((gamers)=>{
        res.json(gamers);
    })
})

app.get('/', (req, res)=>{
    res.send("HELLO WORLD FOR WARZONE");
})
app.listen(PORT, (req,res)=>{
    console.log("APP is listening on port 3000");
});
