import mongoose from "mongoose";





const hostSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  phone: { type: Number, default: null },
  profileImage: { type: String, default: null },
  password: { type: String, required: true },
  hotels: {type:[mongoose.Schema.Types.ObjectId],ref:'Hotel',default: [] },
});

const Host = mongoose.model("Host", hostSchema);
export default Host;
