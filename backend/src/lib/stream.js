import {StreamChat} from "stream-chat"
import { ENV } from "./env.js"
const apiKey=ENV.STREAM_API_KEY
const apiSecret=ENV.STREAM_API_SECRET
if(!apiKey || !apiSecret){
    console.error("Stream API KEY or SECRET is missing");

}
export const chatClient=StreamChat.getInstance(apiKey,apiSecret);


export const upsertStreamUser=async(userData)=>{
    try{
        await chatClient.upsertUsers(userData);
        console.log("Stream user upserted successfully: ",userData);
        return userData
    }
    catch(error){
        console.error("Error upSerting stream user: ",error)
    }
}

export const deleteStreamUser=async(userId)=>{
    try{
        await chatClient.deleteUser(userId)
        console.log("Stream user deleted Successfully",userId)
        return userData
    }
    catch(error){
        console.error("Error deleting stream user: ",error)
    }
}

// todo: add another method to generateToken
