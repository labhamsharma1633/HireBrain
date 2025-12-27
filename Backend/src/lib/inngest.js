import {Inngest} from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest=new Inngest({id:"HireBrain"});

const syncUser=inngest.createFunction( // whenever cleark creates a user run this function
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async({event})=>{
        await connectDB(); // connect to database
        const {id,email_addresses,first_name,last_name,image_url}=event.data  //extract user data from clerk
        const newUser={  //create new object
            clerkId:id,
            email:email_addresses[0]?.email_address,
            name:`${first_name || ""} ${last_name || ""}`,
            profileImage:image_url
        }
        await User.create(newUser); //save user in mongoDB
        await upsertStreamUser({
            id:newUser.clerkId.toString(),
            name:newUser.name,
            image:newUser.profileImage,
        });

    }
    
)
const deleteUserFromDB=inngest.createFunction(
    {id:"delte-user-from-db"},
    {event:"clerk/user.deleted"},
    async({event})=>{
        await connectDB();
        const {id}=event.data
        await User.deleteOne({clerkId:id});
        await deleteStreamUser(id.toString());

    }
    
)
export const functions=[syncUser,deleteUserFromDB];