"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    bookingId: { type: String },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", default: null },
    checkIn: { type: Date },
    checkOut: { type: Date },
    hotelId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Hotel", default: null },
    roomId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "RoomCategory", default: null },
    bookingStatus: { type: String, default: "booked" },
    bookedAt: { type: Date, default: new Date() },
    paymentMethod: { type: String },
    paymentId: { type: mongoose_1.default.Schema.Types.ObjectId || null, ref: "Payment", default: null },
    noOfGuests: { type: Number },
    noOfRooms: { type: Number },
    roomNumbers: { type: [String], default: [] },
    totalAmount: { type: Number },
    GuestDetails: {
        name: { type: String },
        email: { type: String },
        phone: { type: Number },
        country: { type: String }
    },
});
const Booking = mongoose_1.default.model("Booking", bookingSchema);
exports.default = Booking;
