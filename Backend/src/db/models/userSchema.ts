import mongoose from "mongoose";
import Booking from "./bookingSchema";

const walletTransactionType=new mongoose.Schema({
    date:{type:Date},
    type:{type:String},
    totalAmount:{type:Number},
    amoubntRecieved:{type:Number},
    bookingId:{type:String},
})

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
   },
   wallet:{
    type:Number,
    default:0
   },
   walletTransaction:{
    type:[walletTransactionType]
   },
   coupons:{

    type:[mongoose.Schema.Types.ObjectId],ref:"Coupon",default:[]
   }


})
const User=mongoose.model("User",userSchema)
export default User