import mongoose from "mongoose"

const bookingSchema= new mongoose.Schema({
    bookingId:{type:String},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",default:null},
    checkIn:{type:Date},
    checkOut:{type:Date},
    hotelId:{type:mongoose.Schema.Types.ObjectId,ref:"Hotel",default:null},
    roomId:{type:mongoose.Schema.Types.ObjectId,ref:"RoomCategory",default:null},
    paymentMethod:{type:String},
    paymentId:{type:mongoose.Schema.Types.ObjectId||null,ref:"Payment",default:null},
    noOfGuests:{type:Number},
    noOfRooms:{type:Number},
    roomNumbers:{type:[String],default[]},
    totalAmount:{type:Number},

    GuestDetails:{
    name:{type:String},
    email:{type:String},
    phone:{type:Number},
    country:{type:String}
    },
    
})

const Booking= mongoose.model("Booking",bookingSchema)
export default Booking;