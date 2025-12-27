import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req,res){
    try{
        //use clerkID FOR STREAM NOT MONGODB ID IT SHOULD MATCH THE ID WE HAVE IN THE STREAM DASHBOARD;
        const token=chatClient.createToken(req.user.clerkId);
        res.status(200).json({
            token,
            userId:req.user.clerkId,
            userName:req.user.name,
            userImage:req.user.image
        })
    }
    catch(error){
        console.log("ERROR IN GETSTREAMTOKEN CONTROLLERS",error.message);
        res.status(500).json({message:"INternal serverr error"});

    }
}