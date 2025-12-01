import express from "express";
import { ENV } from "./lib/env.js";
const app=express();
console.log(ENV.PORT);
console.log(ENV.DB_URL);
app.get('/',(req,res)=>{
    res.status(200).json({msg:"API IS UP AND RUNNING"})
})
app.listen(ENV.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT   }`);
})