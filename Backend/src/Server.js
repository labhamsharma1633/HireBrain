//const express=require("express");
import express from "express"
import dotenv from "dotenv";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { connect } from "mongoose";
import {serve} from "inngest/express"
import cors from "cors";
import { inngest } from "./lib/inngest.js";
import { functions } from "./lib/inngest.js";
import {clerkMiddleware} from "@clerk/express"
import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoutes.js";


dotenv.config();
const app=express();
app.use(express.json())




app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))
app.use(clerkMiddleware());  //this addd auth field to request object Lreq.auth()
app.use("/api/inngest",serve({client:inngest,functions}))
app.use("/api/chat",chatRoutes);
app.use("/api/sessions",sessionRoutes);
app.get("/",(req,res)=>{
    res.status(200).json({msg:"Success from api"});
})

const startServer=async()=>{
    try{
        await connectDB();
        app.listen(ENV.PORT,()=>{
        console.log("server is running at port",ENV.PORT);
        //connectDB();
    })
    }
    catch(error){
        console.error("Error starting the servers",error);
    }
}
startServer();