import mongoose from "mongoose";

const reportSchema=new mongoose.Schema({
    complaint:{type:String,required:true},
    bookingId:{type:mongoose.Schema.Types.ObjectId,ref:'Booking',required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    hotelId:{type:mongoose.Schema.Types.ObjectId,ref:'Hotel',required:true},
    date:{type:Date}
 
    
})
  const Report=mongoose.model("Report",reportSchema)
  export default Report