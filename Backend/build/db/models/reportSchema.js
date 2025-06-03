"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    complaint: { type: String, required: true },
    bookingId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    hotelId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    date: { type: Date }
});
const Report = mongoose_1.default.model("Report", reportSchema);
exports.default = Report;
