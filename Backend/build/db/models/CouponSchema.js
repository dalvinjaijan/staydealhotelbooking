"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const couponSchema = new mongoose_1.default.Schema({
    city: { type: String, default: null },
    code: { type: String, required: true },
    description: { type: String, required: true },
    validity: { type: Date, required: true },
    offerPercentage: { type: Number, required: true },
    maxDiscount: { type: Number, required: true },
    minPurchase: { type: Number, required: true }
});
const Coupon = mongoose_1.default.model("coupon", couponSchema);
exports.default = Coupon;
