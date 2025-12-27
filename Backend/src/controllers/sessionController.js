import Session  from "../models/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";

export async function createSession(req,res){
    try{
        const {problem,difficulty}=req.body
        const userId=req.user._id
        const clerkID=req.user.clerkID
        if(!problem || !difficulty){
            return res.status(400).json({message:"Problem and Difficulty are required"});

        }
        // generate a uniuque call id for stream video
        const callId=`session_${Date.now()}_${Math.random().toString(36).substring(7)}`
        //create session in DB
        const session=await Session.create({problem,difficulty,host:userId, callId})
        //CREATE STEEAM VIDEO CALL

        await streamClient.video.call("default",callId).getOrCreate({
            data:{
                created_by_id:clerkID,
                custom:{problem,difficulty,sessionId:session._id.toString()},
            },
        })

        //chat messageing

        chatClient.channel("messaging",callId,{
            name:`{problem} Session`,
            created_by_id:clerkID,
            members:[clerkID]
        })
        await channel.create();
        res.status(201).json({session})






    }
    catch(error){
        console.log("Error in createSession controller: ",error.message);
        res.status(500).json({message:"Internal Server Error"});

    }
}

export async function getActiveSession(_,res){
    try{
        const sessions=(await Session.find({status:"active"}).populate("host","name profileImage email clerkId")).toSorted({createdAt:-1}).limit(20);
        res.status(200).json({sessions})

    }
    catch(error){
        console.log("Error in getActiveSessions controller: ",error.message);
        res.status(500).json({message:"Internal Server Error"});

    }
}

export async function getMyRecentSessions(req,res){
    try{
        //get session where user is either host or participant
        const userId=req.user._id;
        await Session.find({status:"completed",
            $or:[{host:userId},{participant:userId}],


        }).sort({createdAt:-1}).limit(20);
        res.status(200).json({sessions});

    }
    catch(error){
        console.log("Error in getMyRecentSessions Controller", error.message);
        res.status(500).json({message:"Internal Server Error"});

    }
}

export async function getSessionById(req,res){
    try{
        const {id}=req.params
        const session=await Session.findById(id).populate("host","name email profileImage clerkId").populate("participant", "name email profileImage clerkId")
        if(!session) return res.status(404).json({message:"Session not found"})
        res.status(200).json({session})

    }
    catch(error){
        console.log("error in getSessionbyid controller",error.message);
        res.status(500).json({message:"Internal Server Error"});


    }
}

export async function joinSession(req,res){
    try{
        const {id}=req.params
        const userId=req.user._id
        const clerkId=req.user.clerkId
        const session=await Session.findById(id)

        if(!session){
            return res.status(404).json({message:"Session NOT FOUND"})
        }
        session.participant=userId
        //check if session is already funn has a participant
        if(session.participant) return res.status(404).json({message:"Session is full"})
        session.participant=userId
        await session.save()

        const channel=chatClient.channel("messaging",session.callId)
        await channel.addMembers([clerkId])

        res.status(200).json({session})

    

    }
    catch(error){
        console.log("Error in join Session controller: ",error.message);
        res.status(500).json({message:"Internal Server error"});
        
    }
}

export async function endSession(req,res){
    try{
        const {id}=req.params
        const userId=req.user._id
        const session=await Session.findById(id)
        if(!session) return res.status(404).json({message:"Session not found"});
        // check if user is the host

        if(session.host.toString()!==userId.toString()){
            return res.status(403).json({message:"Only the host can end the session"});
        }
        // check if session is already completed
        if(session.status==="completed"){
            return res.status(400).json({message:"Session is already completed"});
        }
        session.status="completed"
        await session.save()

        // delete stream video call
        const call=streamClient.video.call("default",session.callId)
        await call.delete({hard:true})
        //delete stream chat
        const channel=chatClient.channel("messaging",session.callId);
        await channel.delete();

        res.status(200).json({session,message:"Session ended successfully"});

    }
    catch(error){
        console.log("Error in endSession controller",error.message);
        res.status(500).json({message:"Internal Server Error"});

    }
}