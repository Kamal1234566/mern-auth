import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
 export const connectdb=async()=>{
    try{

    await mongoose.connect(process.env.MONGO_URI, { dbName: 'user-authentication' });
    console.log(' MongoDB connected');
    }catch(error){
    console.log(error);
     process.exit(1);
    };
    
 }
 