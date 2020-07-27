import express from 'express';
import helmet from 'helmet';
let app = express()
app.use(helmet());
let PORT = process.env.PORT || 3000;
app.get('/', (req, res)=>{
    res.send("HELLO WORLD FOR WARZONE");
})
app.listen(PORT, (req,res)=>{
    console.log("APP is listening on port 3000");
});
