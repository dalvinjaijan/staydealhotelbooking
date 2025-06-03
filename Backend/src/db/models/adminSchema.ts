import mongoose from "mongoose";
const walletTransactionType=new mongoose.Schema({
    date:{type:Date},
    type:{type:String},
    totalAmount:{type:Number},
    amountRecieved:{type:Number},
    bookingId:{type:String},
    hotelName:{type:String},
    adminCharge:{type:Number}
})

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
   },
   wallet:{
    type:Number,
    default:0
   },
   walletTransaction:{
    type:[walletTransactionType]
   }
})
const Admin=mongoose.model("admin",adminSchema)
export default Admin