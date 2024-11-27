"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomCategorySchema = new mongoose_1.default.Schema({
    roomType: { type: String, default: null },
    roomSize: { type: String, default: null },
    noOfRooms: { type: Number, default: null },
    roomPrice: { type: Number, default: null },
    roomAmenities: { type: [String], default: [] },
    roomPhotos: { type: [String], default: [] },
});
const roomPolicySchema = new mongoose_1.default.Schema({
    checkIn: { type: String, default: null },
    checkOut: { type: String, default: null },
});
const hotelSchema = new mongoose_1.default.Schema({
    hotelName: { type: String, default: null },
    address: { type: Object },
    totalNoOfRooms: { type: Number, default: null },
    amenities: { type: [String], default: [] },
    hotelPhoto: { type: [String], default: [] },
    roomCategories: [roomCategorySchema],
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
    editedData: { type: { hotelName: { type: String, default: null },
            address: { type: Object },
            totalNoOfRooms: { type: Number, default: null },
            amenities: { type: [String], default: [] },
            hotelPhoto: { type: [String], default: [] },
            roomCategories: [roomCategorySchema],
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
            } }, default: null }
});
const hostSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    phone: { type: Number, default: null },
    profileImage: { type: String, default: null },
    password: { type: String, required: true },
    hotels: [hotelSchema],
});
hotelSchema.index({ location: '2dsphere' }); //2dsphere index to enable geospatial queries
const Host = mongoose_1.default.model("Host", hostSchema);
exports.default = Host;
