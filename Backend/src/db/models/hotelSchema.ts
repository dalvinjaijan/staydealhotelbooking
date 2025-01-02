import mongoose from "mongoose";

const roomPolicySchema = new mongoose.Schema({
    checkIn: { type: String, default: null },
    checkOut: { type: String, default: null },
  });
  

const hotelSchema = new mongoose.Schema({
    hostId:{type:mongoose.Schema.Types.ObjectId,ref:'Host',default: null},
    hotelName: { type: String, default: null },
    address: {type:Object},
    totalNoOfRooms: { type: Number, default: null },
    amenities: { type: [String], default: [] },
    hotelPhoto: { type: [String], default: [] },
    roomCategories: {type:[mongoose.Schema.Types.ObjectId],ref:'RoomCategory',default: []},
    roomPolicies: roomPolicySchema,
    hotelRules: { type: [String], default: [] },
    cancellationPolicy: { type: String, default: null },
    isHotelListed:{ type:String,default:"pending"},
    location: {
      type: {
        type: String,
        enum: ['Point'], // Must be 'Point'
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number], // Array of numbers: [longitude, latitude]
        required: true
      }
    },
    editedData:{type:Object,default:null}
  });

  
hotelSchema.index({ location: '2dsphere' });  //2dsphere index to enable geospatial queries

  const Hotel=mongoose.model("Hotel",hotelSchema)
  export default Hotel
