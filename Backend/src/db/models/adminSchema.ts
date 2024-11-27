import mongoose from "mongoose";

const adminSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
   profileImage:{
    type:String
   },
   password:{
    type:String
   }


})
const Admin=mongoose.model("admin",adminSchema)
export default Admin