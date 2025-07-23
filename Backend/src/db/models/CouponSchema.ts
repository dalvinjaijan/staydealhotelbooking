import mongoose from "mongoose";

const couponSchema=new mongoose.Schema({
    city:{type:String,default:null},
    code:{type:String,required:true},
    description:{type:String,required:true},
    validity:{type:Date,required:true},
    offerPercentage:{type:Number,required:true},
    maxDiscount:{type:Number,required:true},
    minPurchase:{type:Number,required:true}
})
const Coupon=mongoose.model("coupon",couponSchema)
export default Coupon;