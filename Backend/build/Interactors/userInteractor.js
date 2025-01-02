"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInteractor = void 0;
const jwt_1 = require("../Utils/jwt");
const nodemailer_1 = require("../Utils/nodemailer");
const errorHandling_1 = require("../Adapters/middlewares/errorHandling");
class userInteractor {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getUserByEmail(email) {
        try {
            const user = await this.repository.getUserDetails(email);
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async sendOtp(email) {
        try {
            const otp = await (0, nodemailer_1.sendMail)(email);
            return otp;
        }
        catch (error) {
            throw error;
        }
    }
    async verifyOTP(otp, email, sessionOTP, res) {
        try {
            if (otp === sessionOTP) {
                const userId = await this.repository.findUserByEmail(email);
                if (userId) {
                    const identity = 'user';
                    const accessToken = (0, jwt_1.generateAcessToken)(res, userId.toString(), identity);
                    const refreshToken = (0, jwt_1.generateRefreshToken)(res, userId.toString(), identity);
                    return { accessToken, refreshToken, userId };
                }
                else {
                    const userId = await this.repository.createUser(email);
                    const identity = 'user';
                    const accessToken = (0, jwt_1.generateAcessToken)(res, userId.toString(), identity);
                    const refreshToken = (0, jwt_1.generateRefreshToken)(res, userId.toString(), identity);
                    console.log("Accesstoken", accessToken);
                    return { accessToken, refreshToken, userId };
                }
            }
            else {
                const error = new errorHandling_1.customError("Incorrect OTP", 401);
                // error.message = 'Incorrect OTP'
                // error.status = 401
                throw error;
            }
        }
        catch (error) {
            throw error;
        }
    }
    async getUserDetails(userId) {
        const userDetails = this.repository.findUserById(userId);
        return userDetails;
    }
    async saveProfile(data, profileImage) {
        const { userId } = data;
        const user = await this.repository.findUserById(userId);
        if (user) {
            // console.log("user in saveProfile",user)
            await this.repository.saveUserDetails(user, data, profileImage);
            return { message: "user update succcessfully" };
        }
    }
    async getNearbyHotels(lat, lng) {
        try {
            const response = await this.repository.fetchNearByHotels(lat, lng);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async getHotels(data) {
        try {
            const response = await this.repository.searchHotels(data);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async getFilteredHotels(data) {
        try {
            const response = await this.repository.fetchFilteredHotels(data);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async fetchHotel(data) {
        try {
            const response = await this.repository.getHotelDetails(data);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async fetchHotelDetails(data) {
        try {
            const response = await this.repository.fetchHotelDetails(data);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async bookRoom(bookingDetails) {
        try {
            const response = await this.repository.reserveRoom(bookingDetails);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async myOrders(type, userId) {
        try {
            if (type === "upcoming") {
                const response = await this.repository.getUpcomingOrders(userId);
                return response;
            }
            else {
                const response = await this.repository.getCompletedOrders(userId);
                return response;
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.userInteractor = userInteractor;
