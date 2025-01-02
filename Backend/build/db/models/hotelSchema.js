"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomPolicySchema = new mongoose_1.default.Schema({
    checkIn: { type: String, default: null },
    checkOut: { type: String, default: null },
});
const hotelSchema = new mongoose_1.default.Schema({
    hostId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Host', default: null },
    hotelName: { type: String, default: null },
    address: { type: Object },
    totalNoOfRooms: { type: Number, default: null },
    amenities: { type: [String], default: [] },
    hotelPhoto: { type: [String], default: [] },
    roomCategories: { type: [mongoose_1.default.Schema.Types.ObjectId], ref: 'RoomCategory', default: [] },
    roomPolicies: roomPolicySchema,
    hotelRules: { type: [String], default: [] },
    cancellationPolicy: { type: String, default: null },
    isHotelListed: { type: String, default: "pending" },
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
    editedData: { type: Object, default: null }
});
hotelSchema.index({ location: '2dsphere' }); //2dsphere index to enable geospatial queries
const Hotel = mongoose_1.default.model("Hotel", hotelSchema);
exports.default = Hotel;
