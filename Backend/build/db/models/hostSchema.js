"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hostSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    phone: { type: Number, default: null },
    profileImage: { type: String, default: null },
    password: { type: String, required: true },
    hotels: { type: [mongoose_1.default.Schema.Types.ObjectId], ref: 'Hotel', default: [] },
});
const Host = mongoose_1.default.model("Host", hostSchema);
exports.default = Host;
