
import mongoose from "mongoose";
const userSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true
        },otp:{
         type:String,
         default:''
        },
       otpExpires:{
        type:Number,
        default:0
       },
       isAccountVerified:{
        type:Boolean,
        default:false
       },
       resetOtp:{
        type:String,
        default:''
       },
       resetOtpExpires:{
        type:Number,
        default:0
       }
    },{
        timestamps:true,
       }
)
 const userModel= new mongoose.model('userModel',userSchema);
 export default userModel;