import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    phone:{
        type:Number
    },
   profileImage:{
    type:String
   },
   dob:{
    type:Date
   },
   isBlocked:{
    type:Boolean,
    default:false
   }


})
const User=mongoose.model("User",userSchema)
export default User