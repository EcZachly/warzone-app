import express from 'express';
import helmet from 'helmet';
import api_router from './routes/api_router';
import view_router from './routes/view_router';
import bodyParser from 'body-parser';

let app = express();
app.use(helmet());
let PORT = process.env.PORT || 3000;

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set("views", "views")
app.use(view_router);
app.use('/api', api_router)

app.get('/', (req, res)=>{
    res.send("HELLO WORLD FOR WARZONE!");
});
app.listen(PORT, (req,res)=>{
    console.log("APP is listening on port 3000");
});
