"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminInteractor = void 0;
const errorHandling_1 = require("../Adapters/middlewares/errorHandling");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../Utils/jwt");
class adminInteractor {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async verifyLogin(email, password, res) {
        try {
            const isEmailExist = await this.repository.findByEmail(email);
            if (!isEmailExist) {
                const error = new errorHandling_1.customError('Incorrect email', 401);
                throw error;
            }
            const adminId = isEmailExist._id;
            const isPasswordValid = await bcryptjs_1.default.compare(password, isEmailExist.password);
            console.log("valid pasword", isPasswordValid);
            if (!isPasswordValid) {
                const error = new errorHandling_1.customError('Incorrect password', 401);
                throw error;
            }
            const identity = 'admin';
            const accessToken = (0, jwt_1.generateAcessToken)(res, adminId.toString(), identity);
            const refreshToken = (0, jwt_1.generateRefreshToken)(res, adminId.toString(), identity);
            console.log("Accesstoken", accessToken);
            return {
                message: 'Login successfully',
                adminDetails: isEmailExist,
                accessToken: accessToken,
                refreshToken: refreshToken,
                status: 200,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getHotelRequests() {
        try {
            const response = await this.repository.findHotelRequest();
            return response;
        }
        catch (error) {
        }
    }
    async approvehotelRequests(hostId, hotelId) {
        try {
            const response = await this.repository.approveHotel(hostId, hotelId);
            return response;
        }
        catch (error) {
        }
    }
    async getApprovedHotel() {
        try {
            const response = await this.repository.findApprovedHotel();
            return response;
        }
        catch (error) {
        }
    }
    async blockhotel(hotelId) {
        try {
            const response = await this.repository.blockHotel(hotelId);
            return response;
        }
        catch (error) {
        }
    }
    async getRejectedHotel() {
        try {
            const response = await this.repository.findRejectedHotel();
            return response;
        }
        catch (error) {
        }
    }
    async getUsers() {
        try {
            const response = await this.repository.fetchUsers();
            return response;
        }
        catch (error) {
        }
    }
    async blockuser(userId) {
        try {
            const response = await this.repository.blockUser(userId);
            return response;
        }
        catch (error) {
        }
    }
    async unBlockuser(userId) {
        try {
            const response = await this.repository.unBlockUser(userId);
            return response;
        }
        catch (error) {
        }
    }
    async getEditedHotelRequests() {
        try {
            const response = await this.repository.findEditedHotelRequest();
            return response;
        }
        catch (error) {
        }
    }
    async rejectEditHotelRequests(hostId, hotelId) {
        try {
            const response = await this.repository.rejectEditHotelRequests(hostId, hotelId);
            if (response)
                return response;
            return "no hotels found";
        }
        catch (error) {
        }
    }
    async approveEditHotelsRequest(hostId, hotelId) {
        try {
            const response = await this.repository.approveEditHotelRequests(hostId, hotelId);
            if (response)
                return response;
            return "no hotels found";
        }
        catch (error) {
            throw new Error("Error fetching hotel requests");
        }
    }
    async getWalletDetails() {
        try {
            const response = await this.repository.fetchWalletDetails();
            if (response)
                return response;
        }
        catch (error) {
            throw new Error("Error fetching wallet Details");
        }
    }
    async fetchReportLogic(period) {
        try {
            if (period === "yearly") {
                const yearlyData = await this.repository.fetchYearlyBookings();
                return yearlyData;
            }
            else if (period === "monthly") {
                const monthlyData = await this.repository.fetchMonthlyBookings();
                return monthlyData;
            }
            else if (period === "daily") {
                const dailyData = await this.repository.fetchDailyBookings();
                return dailyData;
            }
        }
        catch (error) {
            throw new Error("Error fetching report");
        }
    }
    async fetchComplaint() {
        try {
            const response = await this.repository.fetchComplaints();
            return response;
        }
        catch (error) {
            throw new Error("Error fetching report");
        }
    }
}
exports.adminInteractor = adminInteractor;
