"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    },
    password: {
        type: String
    }
});
const Admin = mongoose_1.default.model("admin", adminSchema);
exports.default = Admin;
