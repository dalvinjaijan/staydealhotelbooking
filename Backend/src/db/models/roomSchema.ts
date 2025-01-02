import mongoose from "mongoose"
const bookedDateSchema = new mongoose.Schema({
  checkIn: { type: Date, default : null },
  checkOut: { type: Date, default : null },
 
});

const detailsOfRoomsSchema = new mongoose.Schema({
  roomNumber: { type: String, default : null },
  isListed: { type: Boolean, default : true },
  BookedDates: { type: [bookedDateSchema], default : [] },
});

const roomCategorySchema = new mongoose.Schema({
    hotelId:{type:mongoose.Schema.Types.ObjectId,ref:'Hotel',default: null},
    hostId:{type:mongoose.Schema.Types.ObjectId,ref:'Host',default: null},
    roomType: { type: String, default: null },
    eachRoomDetails: { type: [detailsOfRoomsSchema], default: [] },
    roomSize: { type: String, default: null },
    noOfRooms: { type: Number, default: null },
    roomPrice: { type: Number, default: null },
    roomAmenities: { type: [String], default: [] },
    roomPhotos: { type: [String], default: [] },
  });


  const RoomCategory = mongoose.model('RoomCategory', roomCategorySchema);
  export default RoomCategory

