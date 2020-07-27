import express from 'express';
let app = express()
let PORT = process.env.PORT || 3000;
app.get('/', (req, res)=>{
    res.send("HELLO WORLD FOR WARZONE");
})
app.listen(PORT, (req,res)=>{
    console.log("APP is listening on port 3000");
});
