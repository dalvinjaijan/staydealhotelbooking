import mongoose from "mongoose";

const ratingSchema=new mongoose.Schema({
    rating:{type:Number,required:true},
    review:{type:String,required:true},
    bookingId:{type:mongoose.Schema.Types.ObjectId,ref:'Booking',required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    hotelId:{type:mongoose.Schema.Types.ObjectId,ref:'Hotel',required:true},
 
    
})
  const Rating=mongoose.model("Rating",ratingSchema)
  export default Rating
