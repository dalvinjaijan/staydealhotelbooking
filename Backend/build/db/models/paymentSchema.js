"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    paymentId: { type: String },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", default: null },
    paidOn: { type: Date },
    status: { type: String },
    hotelId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Hotel", default: null },
    roomId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "RoomCategory", default: null },
    paymentMethod: { type: String },
    TotalAmount: { type: Number },
});
const Payment = mongoose_1.default.model("Payment", paymentSchema);
exports.default = Payment;
