import mongoose from "mongoose"

const paymentSchema= new mongoose.Schema({
    paymentId:{type:String},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",default:null},
    paidOn:{type:Date},
    status:{type:String},
    hotelId:{type:mongoose.Schema.Types.ObjectId,ref:"Hotel",default:null},
    roomId:{type:mongoose.Schema.Types.ObjectId,ref:"RoomCategory",default:null},
    paymentMethod:{type:String},
    TotalAmount:{type:Number},
    
})

const Payment= mongoose.model("Payment",paymentSchema)
export default Payment;