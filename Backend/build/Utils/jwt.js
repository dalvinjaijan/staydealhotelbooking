"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAcessToken = generateAcessToken;
exports.generateRefreshToken = generateRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function generateAcessToken(res, userId, identity) {
    const payload = { userId, role: identity };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_Access_SecretKey, {
        expiresIn: "7d"
    });
    res.cookie(`${identity}AccessToken`, token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 //1 hour
    });
    return token;
}
function generateRefreshToken(res, userId, identity) {
    const payload = { userId, role: identity };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_Refresh_SecretKey, {
        expiresIn: "30d"
    });
    res.cookie(`${identity}RefreshToken`, token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return token;
}
