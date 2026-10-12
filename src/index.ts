import express from "express";

const app = express();

app.get("/", (req, res)=>{
    res.send("denemee");
})

app.listen(process.env.PORT || 3002, ()=>{
    console.log("Listening a PORT 3002");
});