import mongoose from "mongoose";



const roomCategorySchema = new mongoose.Schema({
  roomType: { type: String, default: null },
  roomSize: { type: String, default: null },
  noOfRooms: { type: Number, default: null },
  roomPrice: { type: Number, default: null },
  roomAmenities: { type: [String], default: [] },
  roomPhotos: { type: [String], default: [] },
});

const roomPolicySchema = new mongoose.Schema({
  checkIn: { type: String, default: null },
  checkOut: { type: String, default: null },
});

const hotelSchema = new mongoose.Schema({
  hotelName: { type: String, default: null },
  address: {type:Object},
  totalNoOfRooms: { type: Number, default: null },
  amenities: { type: [String], default: [] },
  hotelPhoto: { type: [String], default: [] },
  roomCategories: [roomCategorySchema],
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
  editedData:{type:{ hotelName: { type: String, default: null },
  address: {type:Object},
  totalNoOfRooms: { type: Number, default: null },
  amenities: { type: [String], default: [] },
  hotelPhoto: { type: [String], default: [] },
  roomCategories: [roomCategorySchema],
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
  }},default:null}
});

const hostSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  phone: { type: Number, default: null },
  profileImage: { type: String, default: null },
  password: { type: String, required: true },
  hotels: [hotelSchema],
});

hotelSchema.index({ location: '2dsphere' });  //2dsphere index to enable geospatial queries
const Host = mongoose.model("Host", hostSchema);
export default Host;
