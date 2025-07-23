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
    async getHotels(updatedData) {
        try {
            const response = await this.repository.searchHotels(updatedData);
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
    async viewTransactions(userId) {
        try {
            const response = await this.repository.fetchWalletTransactions(userId);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async cancelLogic(bookingId, roomPolicies, checkInDate, checkOutDate) {
        try {
            console.log("checkInDate", checkInDate);
            let checkInTime = roomPolicies.checkIn.slice(0, 2);
            let checkInDateOnly = checkInDate.slice(0, 11);
            let correctedCheckInDate = `${checkInDateOnly}${checkInTime}:00:00.000z`;
            console.log("checkInDateSplit", correctedCheckInDate);
            let checkInDateObject = new Date(checkInDate);
            console.log("checkInDateObject", checkInDateObject);
            let istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
            const currentDate = new Date();
            const currentDateIST = new Date(currentDate.getTime() + istOffset);
            // Calculate the difference in milliseconds
            const differenceInMs = checkInDateObject.getTime() - currentDateIST.getTime();
            // Convert the difference to days
            const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
            console.log("Difference in Days:", differenceInDays);
            if (differenceInDays > 2) {
                const response = await this.repository.fullRefund(bookingId);
                return response;
            }
            else if (differenceInDays >= 0 && differenceInDays <= 2) {
                const response = await this.repository.partialRefund(bookingId);
                return response;
            }
            else {
                const response = await this.repository.noRefund(bookingId);
                return response;
            }
        }
        catch (error) {
            throw error;
        }
    }
    async rateTheHotel(data) {
        try {
            const response = await this.repository.rateTheHotel(data);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async reporthotel(data) {
        try {
            const response = await this.repository.reportHotel(data);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    //    async notificationCountUpdater(id: string): Promise<{ count: number }> {
    //     try {
    //       const response = await this.repository.notificationCountUpdater(id);
    //       return response;
    //     } catch (error: any) {
    //       throw new customError(error.message, error.statusCode);
    //     }
    //   }
    //   async notificationsGetter(
    //     id: string
    //   ): Promise<{ notfiyData: INotifyGetterResponse[] | [] }> {
    //     try {
    //       const response = await this.repository.notificationsGetter(id);
    //       if (
    //         response.countOfUnreadMessages.length > 0 &&
    //         response.notfiyData.length > 0
    //       ) {
    //         const data: INotifyGetterResponse[] = response.notfiyData.map(
    //           (data) => {
    //             const matchedItem = response.countOfUnreadMessages.find(
    //               (item) => item._id + "" === data._id + ""
    //             );
    //             return { ...data, count: matchedItem ? matchedItem.count : 1 };
    //           }
    //         );
    //         return { notfiyData: data };
    //       }
    //       return { notfiyData: [] };
    //     } catch (error: any) {
    //       throw new customError(error.message, error.statusCode);
    //     }
    //   }
    async getTopRatedHotels(latLng) {
        try {
            const response = await this.repository.fetchTopRatedHotels(latLng);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async getCoupon(city) {
        try {
            const response = await this.repository.fetchCoupons(city);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async checkCoupon(code, purchaseAmount) {
        try {
            const response = await this.repository.applyCoupon(code, purchaseAmount);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.userInteractor = userInteractor;
