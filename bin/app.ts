//Environment variables
import process from '../environment';
let PORT: number = process.env.PORT || 3000;
//Helper Libraries
import express from 'express';
import { Application } from "express"
import  compress from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';

//Middlewares
import analyticsMiddleware from '../lib/middleware/site_traffic_middleware';

//Routers
import api_router from '../routes/api_router';
import view_router from '../routes/view_router';
let app: Application = express();
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(compress());
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(analyticsMiddleware);
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set("views", "views")
app.use(view_router);
app.use('/api', api_router)

app.get('/', (req, res)=>{
    res.redirect('/gamers');
});
app.listen(PORT, ()=>console.log('listening on port:' + PORT));