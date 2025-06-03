"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
exports.verifyRole = verifyRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../../Utils/jwt");
const dotenv_1 = __importDefault(require("dotenv"));
const userSchema_1 = __importDefault(require("../../db/models/userSchema"));
const errorHandling_1 = require("./errorHandling");
dotenv_1.default.config();
const verifyAccessToken = (type) => {
    return async (req, res, next) => {
        const accessToken = req.cookies[`${type}AccessToken`];
        console.log("req.cookies-->", req.cookies);
        console.log("hyyy");
        console.log("ACCESS-->" + accessToken);
        try {
            console.log("valid");
            const token = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_Access_SecretKey);
            console.log('token decoded================>', token);
            const user = await userSchema_1.default.findById({ _id: token?.userId });
            // console.log("user",user) 
            if (user && user?.isBlocked) {
                const error = new errorHandling_1.customError('User has been blocked', 401);
                throw error;
            }
            req.user = { userId: token.userId, role: token.role };
            next(); // Access token is valid, proceed to the next middleware/route handler
        }
        catch (err) {
            console.log("inside catch");
            if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                console.log("err intsance");
                const refreshToken = req.cookies[`${type}RefreshToken`];
                console.log(refreshToken, "refreshhh");
                if (!refreshToken) {
                    console.log("no refresh token");
                    return res.status(403).json({ message: 'Session expired login again' });
                }
                // Call the function to generate a new access token using the refresh token
                const newAccessToken = regenerateAccessToken(refreshToken, res);
                if (!newAccessToken) {
                    return res.status(403).json({ message: 'Invalid Refresh Token' });
                }
                // Attach the new access token to the request headers or cookies
                req.cookies[`${type}AccessToken`] = newAccessToken;
                next(); // Proceed to the next middleware/route handler
            }
            //else if (err instanceof jwt.JsonWebTokenError) {
            //   console.log(" err JsonWebTokenError");
            //   return res.status(403).json({ message: 'Invalid Access Token' });
            // }
            else {
                console.log(" Internal Server Error");
                next(err);
            }
        }
    };
};
exports.verifyAccessToken = verifyAccessToken;
function regenerateAccessToken(refreshToken, res) {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_Refresh_SecretKey);
        console.log("decoded", decoded);
        const { userId, role } = decoded;
        return (0, jwt_1.generateAcessToken)(res, userId, role);
    }
    catch (err) {
        return null; // Invalid refresh token
    }
}
function verifyRole(allowedRoles) {
    return (req, res, next) => {
        // console.log("role",req.user.role)
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
        }
        next();
    };
}
