"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ratingSchema = new mongoose_1.default.Schema({
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    bookingId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    hotelId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Hotel', required: true },
});
const Rating = mongoose_1.default.model("Rating", ratingSchema);
exports.default = Rating;
