"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRepository = void 0;
const adminSchema_1 = __importDefault(require("../db/models/adminSchema"));
const hostSchema_1 = __importDefault(require("../db/models/hostSchema"));
const userSchema_1 = __importDefault(require("../db/models/userSchema"));
const hotelSchema_1 = __importDefault(require("../db/models/hotelSchema"));
const roomSchema_1 = __importDefault(require("../db/models/roomSchema"));
const dotenv_1 = __importDefault(require("dotenv"));
const bookingSchema_1 = __importDefault(require("../db/models/bookingSchema"));
const reportSchema_1 = __importDefault(require("../db/models/reportSchema"));
const CouponSchema_1 = __importDefault(require("../db/models/CouponSchema"));
dotenv_1.default.config();
class adminRepository {
    adminDb;
    hostDb;
    userDb;
    hotelDb;
    bookingDb;
    reportDb;
    couponDb;
    constructor() {
        this.adminDb = adminSchema_1.default;
        this.hostDb = hostSchema_1.default;
        this.userDb = userSchema_1.default;
        this.hotelDb = hotelSchema_1.default;
        this.bookingDb = bookingSchema_1.default;
        this.reportDb = reportSchema_1.default;
        this.couponDb = CouponSchema_1.default;
    }
    async findByEmail(email) {
        const isAdminExist = await this.adminDb.findOne({ email });
        if (isAdminExist) {
            return isAdminExist;
        }
        return null;
    }
    async findHotelRequest() {
        try {
            const response = await hostSchema_1.default.aggregate([
                {
                    $lookup: {
                        from: "hotels", // The name of the Hotel collection
                        localField: "hotels", // The array of hotel IDs in the Host collection
                        foreignField: "_id", // The `_id` field in the Hotel collection
                        as: "hotelDetails", // Alias for the joined data
                    },
                },
                {
                    $unwind: "$hotelDetails", // Unwind the hotelDetails array to work with individual hotel documents
                },
                {
                    $match: {
                        "hotelDetails.isHotelListed": "pending", // Match only hotels with isHotelListed = "pending"
                    },
                },
                {
                    $project: {
                        _id: 0,
                        hostId: "$_id", // Map host ID
                        hotelName: "$hotelDetails.hotelName", // Map hotel name from hotelDetails
                        ownerFirstName: "$firstName", // Map host's first name
                        ownerLastName: "$lastName", // Map host's last name
                        ownerEmail: "$email", // Map host's email
                        hotelPhoto: "$hotelDetails.hotelPhoto", // Map hotel photos
                        hotelAddress: "$hotelDetails.address", // Map hotel address
                        hotelId: "$hotelDetails._id", // Map hotel ID
                    },
                },
            ]);
            console.log("response", response);
            return response;
        }
        catch (error) {
            console.error("Error fetching hotel requests:", error);
            throw new Error("Error fetching hotel requests");
        }
    }
    async approveHotel(hostId, hotelId) {
        try {
            // Verify the host owns the hotel before approving
            const host = await hostSchema_1.default.findOne({ _id: hostId, hotels: hotelId }); // Ensure the host owns the hotel
            if (!host) {
                console.log('No matching host or hotel found.');
                return { success: false, message: 'No matching host or hotel found.' };
            }
            // Update the `isHotelListed` field in the `Hotel` collection
            const response = await hotelSchema_1.default.updateOne({ _id: hotelId }, { $set: { isHotelListed: 'approved' } });
            if (response.acknowledged && response.modifiedCount > 0) {
                console.log('Hotel successfully approved.');
                return { success: true, message: 'Hotel successfully approved.' };
            }
            else {
                console.log('Failed to update the hotel status.');
                return { success: false, message: 'Failed to update the hotel status.' };
            }
        }
        catch (error) {
            console.error('Error approving hotel:', error);
            throw error;
        }
    }
    async findApprovedHotel() {
        try {
            const response = await this.hostDb.aggregate([
                { $lookup: {
                        from: "hotels",
                        localField: "hotels",
                        foreignField: "_id",
                        as: "hotelDetails"
                    } },
                { $unwind: "$hotelDetails" },
                { $match: { "hotelDetails.isHotelListed": "approved" } },
                {
                    $project: {
                        _id: 0,
                        hostId: "$_id",
                        hotelName: "$hotelDetails.hotelName",
                        ownerFirstName: "$firstName",
                        ownerLastName: "$lastName",
                        ownerEmail: "$email",
                        hotelPhoto: "$hotelDetails.hotelPhoto",
                        hotelAddress: "$hotelDetails.address",
                        hotelId: "$hotelDetails._id",
                    },
                },
            ]);
            console.log("responsesdfsd", response);
            return response;
        }
        catch (error) {
            console.error("Error fetching hotel requests:", error);
            throw new Error("Error fetching hotel requests");
        }
    }
    async blockHotel(hotelId) {
        try {
            const response = await hotelSchema_1.default.updateOne({ _id: hotelId }, { $set: { isHotelListed: 'blocked' } });
            if (response.acknowledged && response.modifiedCount > 0) {
                console.log('Hotel successfully approved and isHotelListed set to true.');
            }
            else {
                console.log('No matching host or hotel found.');
            }
            return response;
        }
        catch (error) {
            console.error('Error approving hotel:', error);
            throw error;
        }
    }
    async findRejectedHotel() {
        try {
            const response = await this.hostDb.aggregate([
                { $lookup: {
                        from: "hotels",
                        localField: "hotels",
                        foreignField: "_id",
                        as: "hotelDetails"
                    } },
                { $unwind: "$hotelDetails" },
                { $match: { "hotelDetails.isHotelListed": "blocked" } },
                {
                    $project: {
                        _id: 0,
                        hostId: "$_id",
                        hotelName: "$hotelDetails.hotelName",
                        ownerFirstName: "$firstName",
                        ownerLastName: "$lastName",
                        ownerEmail: "$email",
                        hotelPhoto: "$hotelDetails.hotelPhoto",
                        hotelAddress: "$hotelDetails.address",
                        hotelId: "$hotelDetails._id",
                    },
                },
            ]);
            console.log("block", response);
            return response;
        }
        catch (error) {
            console.error("Error fetching hotel requests:", error);
            throw new Error("Error fetching hotel requests");
        }
    }
    async fetchUsers(pageNumber) {
        try {
            const limit = 6;
            const skip = limit * (pageNumber - 1);
            const response = await this.userDb.find()
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit);
            console.log("users", response);
            return response;
        }
        catch (error) {
            console.error("Error fetching users", error);
            throw new Error("Error fetching users");
        }
    }
    async blockUser(userId) {
        try {
            const response = await userSchema_1.default.updateOne({ _id: userId }, { $set: { isBlocked: true } });
            return response;
        }
        catch (error) {
            console.error('Error blocking user:', error);
            throw error;
        }
    }
    async unBlockUser(userId) {
        try {
            const response = await userSchema_1.default.updateOne({ _id: userId }, { $set: { isBlocked: false } });
            return response;
        }
        catch (error) {
            console.error('Error unBlocking user:', error);
            throw error;
        }
    }
    async findEditedHotelRequest() {
        try {
            const response = await this.hostDb.aggregate([
                { $lookup: {
                        from: "hotels",
                        localField: "hotels",
                        foreignField: "_id",
                        as: "hotelDetails"
                    } },
                { $unwind: "$hotelDetails" },
                { $match: { "hotelDetails.isHotelListed": "approved", "hotelDetails.editedData": { $ne: null } } },
                {
                    $project: {
                        _id: 0,
                        hostId: "$_id",
                        hotelName: "$hotelDetails.hotelName",
                        ownerFirstName: "$firstName",
                        ownerLastName: "$lastName",
                        ownerEmail: "$email",
                        hotelPhoto: "$hotelDetails.hotelPhoto",
                        hotelAddress: "$hotelDetails.address",
                        hotelId: "$hotelDetails._id",
                    },
                },
            ]);
            console.log("response of editedHotel", response);
            return response;
        }
        catch (error) {
            console.error("Error fetching hotel requests:", error);
            throw new Error("Error fetching hotel requests");
        }
    }
    async rejectEditHotelRequests(hostId, hotelId) {
        try {
            const response = await hotelSchema_1.default.updateOne({ _id: hotelId }, { $set: { editedData: null } });
            if (response.acknowledged && response.modifiedCount > 0) {
                return "Hotel edited data rejected successfully";
            }
            return "No hotels found";
        }
        catch (error) {
            throw error;
        }
    }
    async approveEditHotelRequests(hostId, hotelId) {
        try {
            const hotel = await hotelSchema_1.default.findOne({ _id: hotelId });
            if (!hotel) {
                return "No hotel found with the given hotelId.";
            }
            // Verify that the hotel belongs to the host
            const host = await hostSchema_1.default.findOne({ _id: hostId, hotels: hotelId });
            if (!host) {
                return "The specified hotel does not belong to the given host.";
            }
            const { editedData } = hotel;
            if (!editedData) {
                return "No edited data found for this hotel.";
            }
            // console.log("Edited Data:", editedData)
            const { roomCategories, ...hotelDataToUpdate } = editedData;
            if ('editedData' in hotelDataToUpdate) {
                delete hotelDataToUpdate.editedData;
            } // Ensure editedData is explicitly cleared
            console.log("hotelDataToUpdate", hotelDataToUpdate);
            const roomCategoryIds = [];
            console.log("roomCategories", roomCategories);
            for (const roomCategory of roomCategories) {
                if (roomCategory._id) {
                    const updatedRoomCategory = await roomSchema_1.default.findByIdAndUpdate(roomCategory._id, roomCategory, { new: true });
                    if (!updatedRoomCategory) {
                        return `Room category with ID ${roomCategory._id} not found.`;
                    }
                    roomCategoryIds.push(updatedRoomCategory._id);
                }
            }
            // Update the hotel with the edited data and clear the `editedData` field
            const response = await hotelSchema_1.default.findByIdAndUpdate(hotelId, {
                $set: {
                    ...hotelDataToUpdate,
                    roomCategories: roomCategoryIds, // Set updated room category IDs
                    editedData: null, // Clear editedData
                },
            }, { new: true });
            console.log("response in approving ", response);
            if (response) {
                return "Hotel edited data approved successfully";
            }
            return "No hotels found";
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching hotel requests");
        }
    }
    async fetchWalletDetails() {
        try {
            console.log("admin Email:", process.env.admin_email);
            const walletDetails = this.adminDb.findOne({ email: process.env.admin_email }, {
                wallet: 1, walletTransaction: 1, _id: 0
            });
            // console.log("walletDetails",walletDetails)
            return walletDetails;
        }
        catch (error) {
            throw new Error("Error fetching hotel requests");
        }
    }
    async fetchYearlyBookings() {
        try {
            const today = new Date();
            const yearStarting = new Date(today);
            yearStarting.setMonth(0);
            yearStarting.setDate(1);
            yearStarting.setUTCHours(0);
            yearStarting.setUTCMinutes(0);
            yearStarting.setUTCSeconds(0);
            console.log(yearStarting);
            let yearlyDates = [];
            for (let i = 9; i >= 0; i--) {
                const year = new Date(yearStarting);
                year.setFullYear(year.getFullYear() - i);
                yearlyDates.push({ year: year });
            }
            let yearDates = [];
            for (let i = 0; i < 10; i++) {
                const saleYear = await this.bookingDb.aggregate([
                    { $match: { bookedAt: {
                                $gte: yearlyDates[i].year,
                                $lte: yearlyDates[i + 1] ? yearlyDates[i + 1].year : new Date()
                            } } },
                    { $match: { bookingStatus: 'booked' } },
                    {
                        $group: {
                            _id: null,
                            noOfBookingPerYear: { $sum: 1 }
                        },
                    },
                    { $project: { _id: 0, noOfBookingPerYear: 1 } }
                ]);
                yearDates.push({ saleYear, year: yearlyDates[i].year });
            }
            console.log("yearDateData", yearDates);
            return yearDates;
        }
        catch (error) {
            throw new Error("Error fetching Yearly bookings");
        }
    }
    async fetchMonthlyBookings() {
        try {
            const today = new Date();
            const monthStart = new Date(today);
            monthStart.setDate(1);
            monthStart.setUTCHours(0);
            monthStart.setUTCMinutes(0);
            monthStart.setUTCSeconds(0);
            console.log(monthStart, "monthStart");
            let monthlyDates = [];
            for (let i = 1; i <= 12; i++) {
                const month = new Date(monthStart);
                month.setMonth(month.getMonth() - (12 - i));
                const monthName = month.toLocaleString('default', { month: 'long' });
                monthlyDates.push({ month: month, monthName: monthName });
            }
            let salesData = [];
            for (let i = 0; i < 12; i++) {
                const saleMonth = await this.bookingDb.aggregate([
                    {
                        $match: {
                            bookedAt: {
                                $gte: monthlyDates[i].month,
                                $lte: monthlyDates[i + 1] ? monthlyDates[i + 1].month : new Date()
                            }
                        }
                    },
                    { $match: { bookingStatus: 'booked' } },
                    {
                        $group: {
                            _id: null, // or any other grouping criteria you need
                            monthlySalesData: { $sum: 1 },
                        }
                    },
                    { $project: {
                            _id: 0,
                            monthlySalesData: 1
                        } }
                ]);
                console.log("salemonth", saleMonth);
                salesData.push({ saleMonth, monthName: monthlyDates[i].monthName });
            }
            console.log("salesData", salesData);
            return salesData;
        }
        catch (error) {
            throw new Error("Error fetching Monthly bookings");
        }
    }
    async fetchDailyBookings() {
        try {
            const today = new Date();
            today.setUTCHours(0);
            today.setUTCMinutes(0);
            today.setUTCSeconds(0);
            const dailyDates = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                dailyDates.push({ date: date });
            }
            console.log("dates", dailyDates);
            let salesData = [];
            for (let i = 0; i < 7; i++) {
                const saleDay = await this.bookingDb.aggregate([
                    { $match: { bookedAt: {
                                $gte: dailyDates[i].date,
                                $lte: dailyDates[i + 1] ? dailyDates[i + 1].date : new Date()
                            } } },
                    { $match: { bookingStatus: 'booked' } },
                    {
                        $group: {
                            _id: null,
                            noOfBookingPerDay: { $sum: 1 }
                        },
                    },
                    { $project: { _id: 0, noOfBookingPerDay: 1 } }
                ]);
                salesData.push({ saleDay, day: dailyDates[i].date });
            }
            console.log("salesData", salesData);
            return salesData;
        }
        catch (error) {
            throw new Error("Error fetching Daily bookings");
        }
    }
    async fetchComplaints() {
        try {
            const complaints = await this.reportDb.find()
                .populate({
                path: "userId",
                select: "firstName lastName",
            })
                .populate({
                path: "hotelId",
                select: "hotelName",
            })
                .sort({ date: -1 });
            return complaints;
        }
        catch (error) {
            console.error("Error fetching complaints:", error);
            throw error;
        }
    }
    async addCoupon(data) {
        try {
            console.log("city", data.city, "data", data);
            if (typeof data.offerPercentage == "string" && typeof data.maxDiscount == "string" && typeof data.minPurchase == 'string') {
                const offerPercentage = parseInt(data.offerPercentage);
                const validity = new Date(data.validity);
                const maxDiscount = parseInt(data.maxDiscount);
                const minPurchase = parseInt(data.minPurchase);
                await this.couponDb.create({
                    city: data.city ?? null,
                    code: data.code,
                    description: data.description,
                    validity,
                    offerPercentage,
                    maxDiscount,
                    minPurchase
                });
                return "Coupon added successfully";
            }
            else {
                return "Having trouble in adddnig coupon";
            }
        }
        catch (error) {
            throw new Error("Having trouble in adddnig coupon");
        }
    }
    async fetchCoupon(pageNumber) {
        try {
            const limit = 8;
            const skip = (pageNumber - 1) * limit;
            const result = await this.couponDb.find({ validity: { $gte: new Date() } }, { _id: 0 })
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit);
            if (result.length > 0) {
                return result;
            }
            else {
                return "No active coupons available";
            }
        }
        catch (error) {
            throw new Error("Having trouble in fetching coupons");
        }
    }
}
exports.adminRepository = adminRepository;
