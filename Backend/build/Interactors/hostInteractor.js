"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostInteractor = void 0;
const errorHandling_1 = require("../Adapters/middlewares/errorHandling");
const jwt_1 = require("../Utils/jwt");
const nodemailer_1 = require("../Utils/nodemailer");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class hostInteractor {
    repository;
    constructor(repository) {
        this.repository = repository;
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
    async verifyOTP(otp, hostDetails, sessionOTP, res) {
        try {
            console.log("session otp", sessionOTP);
            console.log(" otp", otp);
            if (otp === sessionOTP) {
                const hostId = await this.repository.createHost(hostDetails);
                return { message: "Signup successfully" };
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
    async verifyHost(email, password, res) {
        try {
            const hostExist = await this.repository.findHostByEmail(email);
            console.log("hostDetails", hostExist);
            if (!hostExist) {
                throw new errorHandling_1.customError('Incorrect email', 401);
            }
            console.log("password", password, "type", typeof password);
            console.log("hash password", hostExist.password, "type", typeof hostExist.password);
            const hostId = hostExist._id;
            const isPasswordValid = await bcryptjs_1.default.compare(password, hostExist.password);
            console.log("valid pasword", isPasswordValid);
            if (!isPasswordValid) {
                throw new errorHandling_1.customError('Incorrect password', 401);
            }
            const identity = 'host';
            const accessToken = (0, jwt_1.generateAcessToken)(res, hostId.toString(), identity);
            const refreshToken = (0, jwt_1.generateRefreshToken)(res, hostId.toString(), identity);
            console.log("Accesstoken", accessToken);
            return {
                message: 'Login successfully',
                hostDetails: hostExist,
                accessToken: accessToken,
                refreshToken: refreshToken,
                status: 200,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async addHotelDetails(data, hotelPhotos, roomPhotos) {
        try {
            const { hostid } = data;
            // console.log("host id",data)
            // const hostDetails=await this.repository.findHostById(hostid)
            const { message, newlyAddedHotel } = await this.repository.addHotel(data, hostid, hotelPhotos, roomPhotos);
            if (message !== "Request for adding hotel is sent") {
                throw new errorHandling_1.customError('error while adding hotel', 401);
            }
            return { message, newlyAddedHotel };
        }
        catch (error) {
            throw error;
        }
    }
    async getHotels(hostId) {
        try {
            const response = await this.repository.fetchHotels(hostId);
            return response;
        }
        catch (error) {
        }
    }
    async editHotelRequest(editedData, hostId) {
        try {
            const response = await this.repository.addingEditedhotelData(editedData, hostId);
            return response;
        }
        catch (error) {
        }
    }
    async viewProfile(hostId) {
        try {
            const response = await this.repository.fetchProfileDetails(hostId);
            return response;
        }
        catch (error) {
        }
    }
    async viewTransactions(hostId) {
        try {
            const response = await this.repository.fetchWalletTransactions(hostId);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async fetchReportLogic(period, hostId) {
        try {
            if (period === "yearly") {
                const yearlyData = await this.repository.fetchYearlyBookings(hostId);
                return yearlyData;
            }
            else if (period === "monthly") {
                const monthlyData = await this.repository.fetchMonthlyBookings(hostId);
                return monthlyData;
            }
            else if (period === "daily") {
                const dailyData = await this.repository.fetchDailyBookings(hostId);
                return dailyData;
            }
        }
        catch (error) {
            throw new Error("Error fetching report");
        }
    }
    async fetchPieData(hostId) {
        try {
            const dailyData = await this.repository.fetchPieReport(hostId);
            return dailyData;
        }
        catch (error) {
            throw new Error("Error fetching report");
        }
    }
    async reservations(type, hostId) {
        try {
            if (type === "upcoming") {
                const response = await this.repository.getUpcomingOrders(hostId);
                return response;
            }
            else {
                const response = await this.repository.getCompletedOrders(hostId);
                return response;
            }
        }
        catch (error) {
            throw error;
        }
    }
    async notificationCountUpdater(id) {
        try {
            const response = await this.repository.notificationCountUpdater(id);
            return response;
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
    async notificationsGetter(id) {
        try {
            const response = await this.repository.notificationsGetter(id);
            console.log("his.providerRepo.notificationsGetter(id)", response);
            if (response.countOfUnreadMessages.length > 0 &&
                response.notfiyData.length > 0) {
                const data = response.notfiyData.map((data) => {
                    const matchedItem = response.countOfUnreadMessages.find((item) => item._id + "" === data._id + "");
                    return { ...data, count: matchedItem ? matchedItem.count : 1 };
                });
                return { notfiyData: data };
            }
            return { notfiyData: [] };
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
}
exports.hostInteractor = hostInteractor;
