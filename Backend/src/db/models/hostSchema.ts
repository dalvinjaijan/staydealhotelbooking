import mongoose from "mongoose";


const walletTransactionType=new mongoose.Schema({
    date:{type:Date},
    type:{type:String},
    totalAmount:{type:String},
    amountRecieved:{type:Number},
    bookingId:{type:String},
    hostCharge:{type:Number}

})


const hostSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  phone: { type: Number, default: null },
  profileImage: { type: String, default: null },
  password: { type: String, required: true },
  hotels: {type:[mongoose.Schema.Types.ObjectId],ref:'Hotel',default: [] },
  wallet:{
    type:Number,
    default:0
   },
   walletTransaction:{
    type:[walletTransactionType]
   }
});

const Host = mongoose.model("Host", hostSchema);
export default Host;
