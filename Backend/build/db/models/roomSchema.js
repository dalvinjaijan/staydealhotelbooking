"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookedDateSchema = new mongoose_1.default.Schema({
    checkIn: { type: Date, default: null },
    checkOut: { type: Date, default: null },
});
const detailsOfRoomsSchema = new mongoose_1.default.Schema({
    roomNumber: { type: String, default: null },
    isListed: { type: Boolean, default: true },
    BookedDates: { type: [bookedDateSchema], default: [] },
});
const roomCategorySchema = new mongoose_1.default.Schema({
    hotelId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Hotel', default: null },
    hostId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Host', default: null },
    roomType: { type: String, default: null },
    eachRoomDetails: { type: [detailsOfRoomsSchema], default: [] },
    roomSize: { type: String, default: null },
    noOfRooms: { type: Number, default: null },
    roomPrice: { type: Number, default: null },
    roomAmenities: { type: [String], default: [] },
    roomPhotos: { type: [String], default: [] },
});
const RoomCategory = mongoose_1.default.model('RoomCategory', roomCategorySchema);
exports.default = RoomCategory;
