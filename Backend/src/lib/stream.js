import {StreamChat} from "stream-chat"
import { StreamClient } from "@stream-io/node-sdk"
import { ENV } from "./env.js"
const apiKey=ENV.STREAM_API_KEY
const apiSecret=ENV.STREAM_API_SECRET
if(!apiKey || !apiSecret){
    console.error("Stream API KEY OR SECRET IS MISSING ");
}
export const streamClient=new StreamClient(apiKey,apiSecret); // THIS WILL BE USED FOR VIDEO CALL
export const chatClient=StreamChat.getInstance(apiKey,apiSecret);  // this will be used for chat 

export const upsertStreamUser=async(userData)=>{
    try{
        await chatClient.upsertUser(userData);
        console.log("Stream user upserted successfully: ",userData);

    }
    catch(error){
        console.log("Error upserting stream user: ",error);

    }
}
export const deleteStreamUser=async(userData)=>{
    try{
        await chatClient.deleteUser([userData]);
        console.log("STREAM USER DELETED SUCCESSFULLY",userID);

    }
    catch(error){
        console.log("Error DELETETING stream user: ",error);

    }
}