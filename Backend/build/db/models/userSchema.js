"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const walletTransactionType = new mongoose_1.default.Schema({
    date: { type: Date },
    type: { type: String },
    totalAmount: { type: Number },
    amoubntRecieved: { type: Number },
    bookingId: { type: String },
});
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    phone: {
        type: Number
    },
    profileImage: {
        type: String
    },
    dob: {
        type: Date
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    wallet: {
        type: Number,
        default: 0
    },
    walletTransaction: {
        type: [walletTransactionType]
    },
    coupons: {
        type: [mongoose_1.default.Schema.Types.ObjectId], ref: "Coupon", default: []
    }
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
