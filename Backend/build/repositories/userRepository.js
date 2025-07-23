"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema_1 = __importDefault(require("../db/models/userSchema"));
const hostSchema_1 = __importDefault(require("../db/models/hostSchema"));
const hotelSchema_1 = __importDefault(require("../db/models/hotelSchema"));
const roomSchema_1 = __importDefault(require("../db/models/roomSchema"));
const paymentSchema_1 = __importDefault(require("../db/models/paymentSchema"));
const bookingSchema_1 = __importDefault(require("../db/models/bookingSchema"));
const invoiceEmail_1 = require("../Utils/invoiceEmail");
const adminSchema_1 = __importDefault(require("../db/models/adminSchema"));
const ratingSchema_1 = __importDefault(require("../db/models/ratingSchema"));
const reportSchema_1 = __importDefault(require("../db/models/reportSchema"));
const errorHandling_1 = require("../Adapters/middlewares/errorHandling");
const CouponSchema_1 = __importDefault(require("../db/models/CouponSchema"));
class userRepository {
    userDB;
    hostDb;
    hotelDb;
    roomCategoryDb;
    paymentDb;
    bookingDb;
    adminDb;
    ratingDb;
    reportDb;
    couponDb;
    constructor() {
        this.userDB = userSchema_1.default;
        this.hostDb = hostSchema_1.default;
        this.hotelDb = hotelSchema_1.default;
        this.roomCategoryDb = roomSchema_1.default;
        this.paymentDb = paymentSchema_1.default;
        this.bookingDb = bookingSchema_1.default;
        this.adminDb = adminSchema_1.default;
        this.ratingDb = ratingSchema_1.default;
        this.reportDb = reportSchema_1.default;
        this.couponDb = CouponSchema_1.default;
    }
    async findUserByEmail(email) {
        const userExists = await this.userDB.findOne({ email: email });
        if (userExists) {
            const userId = userExists._id;
            return userId;
        }
    }
    async getUserDetails(email) {
        const userExists = await this.userDB.findOne({ email: email });
        //   console.log("userDetails",userExists,typeof userExists)
        return userExists;
    }
    async createUser(email) {
        try {
            const newUser = new this.userDB({ email });
            await newUser.save();
            return newUser._id;
        }
        catch (error) {
            throw new Error('Error creating new user');
        }
    }
    async findUserById(userId) {
        try {
            const user = await this.userDB.findOne({ _id: userId });
            // console.log("userExist profile-->",user);
            return user;
        }
        catch (error) {
        }
    }
    async saveUserDetails(user, userDetails, profileImage) {
        try {
            const { email, firstName, lastName, dob, phone } = userDetails;
            user.email = email;
            user.firstName = firstName;
            user.lastName = lastName;
            user.dob = dob;
            user.phone = phone;
            if (profileImage) {
                user.profileImage = profileImage;
            }
            user.save();
            console.log("savinguser->", user);
        }
        catch (error) {
            throw new Error('Failed to save user details');
        }
    }
    async fetchNearByHotels(lat, lng) {
        try {
            const earthRadiusInMiles = 3963.2; // Radius of Earth in miles
            const maxDistanceInMiles = 50; // Search radius in miles
            const hotels = await hotelSchema_1.default.aggregate([
                {
                    $match: {
                        isHotelListed: "approved", // Only approved hotels
                        location: {
                            $geoWithin: {
                                $centerSphere: [[lng, lat], maxDistanceInMiles / earthRadiusInMiles]
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "hosts", // Assuming your hosts collection is named 'hosts'
                        localField: "_id",
                        foreignField: "hotels",
                        as: "hostDetails"
                    }
                },
                {
                    $unwind: { path: "$hostDetails", preserveNullAndEmptyArrays: true }
                },
                {
                    $lookup: {
                        from: "ratings",
                        localField: "_id",
                        foreignField: "hotelId",
                        as: "ratings"
                    }
                },
                {
                    $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true }
                },
                {
                    $lookup: {
                        from: "users", // Assuming your users collection is named 'users'
                        localField: "ratings.userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true }
                },
                {
                    $lookup: {
                        from: "roomcategories",
                        localField: "roomCategories",
                        foreignField: "_id",
                        as: "roomCategoryDetails"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        hotelId: { $first: "$_id" },
                        hotelName: { $first: "$hotelName" },
                        amenities: { $first: "$amenities" },
                        totalNoOfRooms: { $first: "$totalNoOfRooms" },
                        address: { $first: "$address" },
                        hotelPhoto: { $first: "$hotelPhoto" },
                        roomCategories: { $first: "$roomCategoryDetails" },
                        roomPolicies: { $first: "$roomPolicies" },
                        hotelRules: { $first: "$hotelRules" },
                        cancellationPolicy: { $first: "$cancellationPolicy" },
                        location: { $first: "$location.coordinates" },
                        hostId: { $first: "$hostDetails._id" },
                        ratings: {
                            $push: {
                                _id: "$ratings._id",
                                rating: "$ratings.rating",
                                review: "$ratings.review",
                                bookingId: "$ratings.bookingId",
                                user: {
                                    _id: "$userDetails._id",
                                    email: "$userDetails.email",
                                    profileImage: "$userDetails.profileImage",
                                    firstName: "$userDetails.firstName",
                                    lastName: "$userDetails.lastName"
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        hotelId: 1,
                        hotelName: 1,
                        amenities: 1,
                        totalNoOfRooms: 1,
                        address: 1,
                        hotelPhoto: 1,
                        roomCategories: 1,
                        roomPolicies: 1,
                        hotelRules: 1,
                        cancellationPolicy: 1,
                        location: 1,
                        hostId: 1,
                        ratings: {
                            $filter: {
                                input: "$ratings",
                                as: "rating",
                                cond: { $ne: ["$$rating._id", null] }
                            }
                        }
                    }
                }
            ]);
            console.log("Hotels listed", hotels);
            return hotels;
        }
        catch (error) {
            throw error;
        }
    }
    async searchHotels(updatedData) {
        try {
            const { lat, lng } = updatedData.lngLat;
            const earthRadiusInMiles = 3963.2; // Radius of Earth in miles
            const maxDistanceInMiles = 50; // 1 mile
            const hotels = await hotelSchema_1.default.aggregate([
                {
                    $match: {
                        isHotelListed: "approved", // Only approved hotels
                        location: {
                            $geoWithin: {
                                $centerSphere: [[lng, lat], maxDistanceInMiles / earthRadiusInMiles]
                            }
                        },
                        hotelName: { $regex: `^${updatedData.searchInput}`, $options: "i" }
                    }
                },
                {
                    $lookup: {
                        from: "roomcategories",
                        localField: "roomCategories",
                        foreignField: "_id",
                        as: "roomCategoryDetails"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        hotelId: "$_id",
                        hotelName: "$hotelName",
                        amenities: "$amenities",
                        totalNoOfRooms: "$totalNoOfRooms",
                        address: "$address",
                        hotelPhoto: "$hotelPhoto",
                        roomCategories: "$roomCategoryDetails",
                        roomPolicies: "$roomPolicies",
                        hotelRules: "$hotelRules",
                        cancellationPolicy: "$cancellationPolicy",
                        "location.coordinates": 1 // Include coordinates in the result if needed
                    }
                }
            ]);
            console.log("hotels listed", hotels);
            return hotels;
        }
        catch (error) {
            throw error;
        }
    }
    async fetchFilteredHotels(data) {
        try {
            const { lat, lng } = data.lngLat;
            const earthRadiusInMiles = 3963.2; // Radius of Earth in miles
            const maxDistanceInMiles = 50; // Max distance in miles
            // Create room type filter to match any of the selected room types
            const roomTypeFilter = data.roomTypes.length > 0 ? {
                "roomCategoryDetails.roomType": { $in: data.roomTypes }
            } : {};
            console.log("roomTypeFilter", roomTypeFilter);
            // Create other filters (e.g., "Couple friendly", "Pet friendly") to match any in hotelRules
            const otherFilter = data.otherFilters.length > 0 ? {
                hotelRules: { $in: data.otherFilters }
            } : {};
            console.log("otherFilter", otherFilter);
            const hotels = await hotelSchema_1.default.aggregate([
                {
                    $lookup: {
                        from: "roomcategories",
                        localField: "roomCategories",
                        foreignField: "_id",
                        as: "roomCategoryDetails"
                    }
                },
                {
                    $match: {
                        isHotelListed: "approved", // Only approved hotels
                        // Geo location filter within 50 miles
                        location: {
                            $geoWithin: {
                                $centerSphere: [[lng, lat], maxDistanceInMiles / earthRadiusInMiles]
                            }
                        },
                        ...roomTypeFilter,
                        ...otherFilter
                    }
                },
                {
                    $project: {
                        _id: 0,
                        hotelId: "$_id",
                        hotelName: "$hotelName",
                        amenities: "$amenities",
                        totalNoOfRooms: "$totalNoOfRooms",
                        address: "$address",
                        hotelPhoto: "$hotelPhoto",
                        roomCategories: "$roomCategoryDetails",
                        roomPolicies: "$roomPolicies",
                        hotelRules: "$hotelRules",
                        cancellationPolicy: "$cancellationPolicy",
                        "location.coordinates": 1 // Include coordinates if needed
                    }
                }
            ]);
            console.log("Filtered hotels:", hotels);
            return hotels;
        }
        catch (error) {
            throw error;
        }
    }
    async getHotelDetails(data) {
        try {
            const { lat, lng } = data.lngLat;
            let { checkIn, checkOut, numberOfRooms } = data;
            const earthRadiusInMiles = 3963.2;
            const maxDistanceInMiles = 50;
            const searchData = data.searchTerm.split(",");
            const hotelname = searchData.splice(0, 1);
            const hotelName = hotelname.join('');
            const address = searchData.join(',');
            console.log("hotelName", hotelName, address);
            const hotelDetails = await hotelSchema_1.default.aggregate([
                {
                    $match: {
                        isHotelListed: "approved",
                        location: {
                            $geoWithin: {
                                $centerSphere: [[lng, lat], maxDistanceInMiles / earthRadiusInMiles]
                            }
                        },
                        hotelName: { $regex: `^${hotelName}`, $options: "i" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        roomPolicies: 1
                    }
                }
            ]);
            console.log("bookingdData", data);
            console.log("hotelDetails", hotelDetails);
            const checkInTime = hotelDetails[0].roomPolicies.checkIn.slice(0, 2);
            console.log("checkIn", checkIn, "checkOut", checkOut);
            const checkInDateOnly = checkIn.slice(0, 11);
            checkIn = `${checkInDateOnly}${checkInTime}:00:00.000Z`;
            if (checkOut instanceof Date) {
                const checkOutTime = hotelDetails[0].roomPolicies.checkOut.slice(0, 2);
                const checkOutDateOnly = checkOut.toISOString().split('T')[0];
                checkOut = `${checkOutDateOnly}T${checkOutTime}:00:00.000Z`;
            }
            console.log("checkIn", checkIn, "checkOut", checkOut);
            const hotels = await hotelSchema_1.default.aggregate([
                {
                    $match: {
                        isHotelListed: "approved",
                        location: {
                            $geoWithin: {
                                $centerSphere: [[lng, lat], maxDistanceInMiles / earthRadiusInMiles]
                            }
                        },
                        hotelName: { $regex: `^${hotelName}`, $options: "i" }
                    }
                },
                {
                    $lookup: {
                        from: "ratings",
                        localField: "_id",
                        foreignField: "hotelId",
                        as: "ratings"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "ratings.userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $addFields: {
                        ratings: {
                            $map: {
                                input: "$ratings",
                                as: "rating",
                                in: {
                                    _id: "$$rating._id",
                                    rating: "$$rating.rating",
                                    review: "$$rating.review",
                                    bookingId: "$$rating.bookingId",
                                    user: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$userDetails",
                                                    as: "user",
                                                    cond: { $eq: ["$$user._id", "$$rating.userId"] }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "roomcategories",
                        localField: "roomCategories",
                        foreignField: "_id",
                        as: "roomCategoryDetails"
                    }
                },
                {
                    $unwind: "$roomCategoryDetails",
                },
                {
                    $lookup: {
                        from: "bookings",
                        let: { roomId: "$roomCategoryDetails._id", hotelId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$roomId", "$$roomId"] },
                                            { $eq: ["$hotelId", "$$hotelId"] },
                                            { bookingStatus: "booked" },
                                            {
                                                $or: [
                                                    {
                                                        $and: [
                                                            { $lte: ["$checkIn", new Date(checkOut)] },
                                                            { $gte: ["$checkOut", new Date(checkIn)] },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $group: {
                                    _id: "$roomId",
                                    bookedRooms: { $sum: "$noOfRooms" },
                                },
                            },
                        ],
                        as: "bookedRooms",
                    },
                },
                {
                    $addFields: {
                        "roomCategoryDetails.availableRooms": {
                            $subtract: [
                                "$roomCategoryDetails.noOfRooms",
                                { $ifNull: [{ $arrayElemAt: ["$bookedRooms.bookedRooms", 0] }, 0] },
                            ],
                        },
                        "roomCategoryDetails.isAvailable": {
                            $gte: [
                                {
                                    $subtract: [
                                        "$roomCategoryDetails.noOfRooms",
                                        { $ifNull: [{ $arrayElemAt: ["$bookedRooms.bookedRooms", 0] }, 0] }
                                    ]
                                },
                                numberOfRooms
                            ]
                        },
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        hotelId: { $first: "$_id" },
                        hotelName: { $first: "$hotelName" },
                        amenities: { $first: "$amenities" },
                        totalNoOfRooms: { $first: "$totalNoOfRooms" },
                        address: { $first: "$address" },
                        hotelPhoto: { $first: "$hotelPhoto" },
                        roomCategories: { $push: "$roomCategoryDetails" },
                        roomPolicies: { $first: "$roomPolicies" },
                        hotelRules: { $first: "$hotelRules" },
                        cancellationPolicy: { $first: "$cancellationPolicy" },
                        location: { $first: "$location.coordinates" },
                        ratings: { $addToSet: "$ratings" }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        hotelId: "$_id",
                        hotelName: 1,
                        amenities: 1,
                        totalNoOfRooms: 1,
                        address: 1,
                        hotelPhoto: 1,
                        roomCategories: 1,
                        roomPolicies: 1,
                        hotelRules: 1,
                        cancellationPolicy: 1,
                        location: 1,
                        ratings: {
                            $filter: {
                                input: "$ratings",
                                as: "rating",
                                cond: { $ne: ["$$rating._id", null] }
                            }
                        },
                    },
                },
            ]);
            // Filter room categories to only include those with availability
            hotels.forEach((hotel) => {
                hotel.roomCategories = hotel.roomCategories.filter((roomCategory) => roomCategory.isAvailable);
            });
            console.log("hotels listed", hotels);
            return { hotels, checkIn, checkOut };
        }
        catch (error) {
            throw error;
        }
    }
    async fetchHotelDetails(data) {
        try {
            const { lat, lng } = data.lngLat;
            const earthRadiusInMiles = 3963.2; // Radius of Earth in miles
            const maxDistanceInMiles = 50; // Search radius
            const { checkIn, checkOut, hotelId, roomId, numberOfRooms } = data;
            console.log("object", typeof numberOfRooms, numberOfRooms);
            const hotels = await hotelSchema_1.default.aggregate([
                {
                    $match: {
                        isHotelListed: "approved", // Only approved hotels
                        location: {
                            $geoWithin: {
                                $centerSphere: [[lng, lat], maxDistanceInMiles / earthRadiusInMiles],
                            },
                        },
                        _id: new mongoose_1.default.Types.ObjectId(hotelId),
                    },
                },
                {
                    $lookup: {
                        from: "ratings",
                        localField: "_id",
                        foreignField: "hotelId",
                        as: "ratings"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "ratings.userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $addFields: {
                        ratings: {
                            $map: {
                                input: "$ratings",
                                as: "rating",
                                in: {
                                    _id: "$$rating._id",
                                    rating: "$$rating.rating",
                                    review: "$$rating.review",
                                    bookingId: "$$rating.bookingId",
                                    user: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$userDetails",
                                                    as: "user",
                                                    cond: { $eq: ["$$user._id", "$$rating.userId"] }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "roomcategories",
                        localField: "roomCategories",
                        foreignField: "_id",
                        as: "roomCategoryDetails"
                    },
                },
                {
                    $unwind: "$roomCategoryDetails",
                },
                {
                    $lookup: {
                        from: "bookings",
                        let: { roomId: "$roomCategoryDetails._id", hotelId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$roomId", "$$roomId"] },
                                            { $eq: ["$hotelId", "$$hotelId"] },
                                            { bookingStatus: "booked" },
                                            {
                                                $or: [
                                                    {
                                                        $and: [
                                                            { $lte: ["$checkIn", new Date(checkOut)] },
                                                            { $gte: ["$checkOut", new Date(checkIn)] },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $group: {
                                    _id: "$roomId",
                                    bookedRooms: { $sum: "$noOfRooms" },
                                },
                            },
                        ],
                        as: "bookedRooms",
                    },
                },
                {
                    $addFields: {
                        "roomCategoryDetails.availableRooms": {
                            $subtract: [
                                "$roomCategoryDetails.noOfRooms",
                                { $ifNull: [{ $arrayElemAt: ["$bookedRooms.bookedRooms", 0] }, 0] },
                            ],
                        },
                        "roomCategoryDetails.isAvailable": {
                            // $and: [
                            //     { 
                            $gte: [
                                {
                                    $subtract: [
                                        "$roomCategoryDetails.noOfRooms",
                                        { $ifNull: [{ $arrayElemAt: ["$bookedRooms.bookedRooms", 0] }, 0] }
                                    ]
                                },
                                numberOfRooms
                            ]
                        },
                        //         { $eq: ["$roomCategoryDetails._id",  new mongoose.Types.ObjectId(roomId)] },
                        //     ],
                        // },
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        hotelId: { $first: "$_id" },
                        hotelName: { $first: "$hotelName" },
                        amenities: { $first: "$amenities" },
                        totalNoOfRooms: { $first: "$totalNoOfRooms" },
                        address: { $first: "$address" },
                        hotelPhoto: { $first: "$hotelPhoto" },
                        roomCategories: { $push: "$roomCategoryDetails" },
                        roomPolicies: { $first: "$roomPolicies" },
                        hotelRules: { $first: "$hotelRules" },
                        cancellationPolicy: { $first: "$cancellationPolicy" },
                        location: { $first: "$location.coordinates" },
                        ratings: { $addToSet: "$ratings" }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        hotelId: "$_id",
                        hotelName: 1,
                        amenities: 1,
                        totalNoOfRooms: 1,
                        address: 1,
                        hotelPhoto: 1,
                        roomCategories: 1,
                        roomPolicies: 1,
                        hotelRules: 1,
                        cancellationPolicy: 1,
                        location: 1,
                        ratings: {
                            $filter: {
                                input: "$ratings",
                                as: "rating",
                                cond: { $ne: ["$$rating._id", null] }
                            }
                        },
                    },
                },
            ]);
            // Filter room categories to only include those with availability
            hotels.map((hotel) => {
                return hotel.roomCategories = hotel.roomCategories.filter((roomCategory) => roomCategory.isAvailable);
            });
            console.log("Hotels listed:", JSON.stringify(hotels[0].roomCategories));
            return hotels;
        }
        catch (error) {
            console.error("Error fetching hotel details:", error);
            throw error;
        }
    }
    async reserveRoom(bookingDetails) {
        try {
            // Find the room category
            // Convert checkIn and checkOut to Date objects
            const checkInDate = new Date(bookingDetails.checkIn);
            const checkOutDate = new Date(bookingDetails.checkOut);
            // Find the room category
            const roomCategory = await roomSchema_1.default.findById(bookingDetails.roomId).exec();
            if (!roomCategory) {
                throw new Error("Room category not found.");
            }
            const currentDate = new Date();
            let roomDetails;
            await Promise.all(roomCategory.eachRoomDetails.map(async (room) => {
                room.BookedDates = room.BookedDates.filter((bookedDate) => new Date(bookedDate.checkOut) >= currentDate);
                roomDetails = await room.save(); // Save the updated room details
            }));
            console.log("roomDetails", roomDetails);
            // Filter available rooms directly
            const availableRooms = roomCategory.eachRoomDetails.filter((room) => {
                return room.isListed &&
                    room.BookedDates.every((bookedDate) => {
                        return !((checkInDate < bookedDate.checkOut && checkInDate >= bookedDate.checkIn) ||
                            (checkOutDate > bookedDate.checkOut && checkOutDate <= bookedDate.checkIn) ||
                            (checkInDate <= bookedDate.checkIn && checkOutDate >= bookedDate.checkOut));
                    });
            });
            if (availableRooms.length < bookingDetails.numberOfRooms) {
                throw new Error("Not enough available rooms.");
            }
            // Process payment (if applicable)
            let paymentId = null;
            if (bookingDetails.paymentMethod === "online") {
                // Assuming you have a Payment model
                const payment = new paymentSchema_1.default({
                    paymentId: bookingDetails.paymentId,
                    userId: bookingDetails.userId,
                    hotelId: bookingDetails.hotelId,
                    roomId: bookingDetails.roomId,
                    totalAmount: bookingDetails.totalAmount,
                    paymentMethod: "online",
                    status: "paid",
                    paidOn: new Date(),
                });
                const savedPayment = await payment.save();
                paymentId = savedPayment._id;
            }
            // Reserve rooms
            const reservedRoomNumbers = [];
            for (let i = 0; i < bookingDetails.numberOfRooms; i++) {
                const roomToReserve = availableRooms[i];
                roomToReserve.BookedDates.push({
                    checkIn: bookingDetails.checkIn,
                    checkOut: bookingDetails.checkOut
                });
                reservedRoomNumbers.push(roomToReserve.roomNumber);
            }
            // Save the updated room category
            await roomCategory.save();
            function randomBookingId() {
                const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
                const randomPart = Math.floor(100000 + Math.random() * 900000);
                return "SD" + datePart + randomPart;
            }
            // Assuming you have a Booking model and a Hotel model
            const booking = new bookingSchema_1.default({
                bookingId: randomBookingId(),
                userId: bookingDetails.userId,
                checkIn: bookingDetails.checkIn,
                checkOut: bookingDetails.checkOut,
                hotelId: bookingDetails.hotelId,
                roomId: bookingDetails.roomId,
                paymentMethod: bookingDetails.paymentMethod,
                paymentId,
                noOfGuests: bookingDetails.guestNumber,
                noOfRooms: bookingDetails.numberOfRooms,
                roomNumbers: reservedRoomNumbers,
                totalRoomPrice: bookingDetails.totalRoomPrice,
                discount: bookingDetails.discount,
                totalAmount: bookingDetails.totalAmount,
                GuestDetails: {
                    name: bookingDetails.name,
                    email: bookingDetails.email,
                    phone: bookingDetails.phone,
                    country: bookingDetails.country,
                },
            });
            const savedBooking = await booking.save();
            // Assuming you have a sendInvoice function
            if (savedBooking && bookingDetails.hotelId) {
                const hotel = await hotelSchema_1.default.findById(bookingDetails.hotelId);
                if (hotel) {
                    const emailDataForBooking = {
                        bookingId: savedBooking.bookingId ?? "",
                        hotelName: hotel.hotelName,
                        address: hotel.address,
                        roomNumbers: reservedRoomNumbers,
                        checkIn: bookingDetails.checkIn,
                        checkOut: bookingDetails.checkOut,
                        hotelRules: hotel.hotelRules,
                    };
                    (0, invoiceEmail_1.sendInvoice)(bookingDetails.email, emailDataForBooking);
                }
                if (bookingDetails.paymentMethod === 'online') {
                    const adminCommission = Math.floor(bookingDetails.totalAmount * 10 / 100);
                    const hostReceivableAmount = bookingDetails.totalAmount - adminCommission;
                    const walletTransaction = {
                        date: new Date(),
                        type: "credit",
                        totalAmount: savedBooking.totalAmount,
                        amountRecieved: hostReceivableAmount,
                        bookingId: savedBooking.bookingId
                    };
                    console.log("walletTransaction", walletTransaction, savedBooking.bookingId);
                    await this.adminDb.updateOne({
                        "email": "admin@gmail.com",
                    }, {
                        $inc: { wallet: adminCommission }, // Increment wallet by hostReceivableAmount
                        $push: { walletTransaction: { ...walletTransaction, amountRecieved: adminCommission, hotelName: hotel?.hotelName } }, // Add a new transaction to the walletTransaction array
                    });
                    await this.hostDb.updateOne({
                        "hotels": new mongoose_1.default.Types.ObjectId(bookingDetails.hotelId), // Match the host by hotelId in the hotels array
                    }, {
                        $inc: { wallet: hostReceivableAmount }, // Increment wallet by hostReceivableAmount
                        $push: { walletTransaction: walletTransaction }, // Add a new transaction to the walletTransaction array
                    });
                }
            }
            return {
                success: true,
                message: "Room reserved successfully.",
                booking: savedBooking,
                reservedRoomNumbers,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getUpcomingOrders(userId) {
        try {
            const currentDate = new Date();
            const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
            const upcomingBookings = await bookingSchema_1.default.find({
                userId,
                checkIn: { $gte: startOfToday },
            })
                .populate({
                path: "hotelId",
                select: "hotelName hotelPhoto roomPolicies hostId",
                populate: {
                    path: "hostId",
                    select: "firstName lastName email phone" // Select host details if needed
                }
            })
                .populate("roomId", "roomType")
                .exec();
            console.log("upcomingBookings", upcomingBookings);
            return upcomingBookings;
        }
        catch (error) {
            console.error("Error fetching upcoming bookings:", error);
            throw new Error("Unable to fetch upcoming bookings.");
        }
    }
    async getCompletedOrders(userId) {
        try {
            const currentDate = new Date();
            const completedBookings = await bookingSchema_1.default.find({
                userId,
                checkOut: { $lt: currentDate },
            })
                .populate("hotelId", "hotelName hotelPhoto")
                .populate("roomId", "roomType")
                .exec();
            // console.log("completedBookings", completedBookings)
            const ratings = await this.ratingDb.find({ userId: userId });
            console.log("ratings", ratings);
            return { completedBookings, ratings };
        }
        catch (error) {
            console.error("Error fetching upcoming bookings:", error);
            throw new Error("Unable to fetch upcoming bookings.");
        }
    }
    async fetchWalletTransactions(userId) {
        try {
            const response = await this.userDB.findOne({ _id: userId }, 'walletTransaction');
            console.log("esponse", response);
            return response;
        }
        catch (error) {
            throw new Error("unable to fetch transactions");
        }
    }
    async fullRefund(bookingId) {
        try {
            const bookingDetails = await this.bookingDb.findByIdAndUpdate({ _id: bookingId }, {
                bookingStatus: "cancelled"
            }, { new: true });
            console.log("bookingid", bookingId);
            console.log("bookingDetails", bookingDetails);
            if (!bookingDetails?.checkIn || !bookingDetails?.checkOut) {
                throw new Error("Check-in and Check-out dates are required.");
            }
            if (bookingDetails && bookingDetails.totalAmount && bookingDetails.checkIn && bookingDetails.checkOut && bookingDetails.noOfRooms) {
                if (bookingDetails.paymentMethod === "online") {
                    await this.paymentDb.findByIdAndUpdate(bookingDetails.paymentId, { status: "Refund credited" }, { new: true });
                    let walletTransaction = {
                        date: new Date(),
                        type: "Refund credited",
                        totalAmount: bookingDetails.totalAmount,
                        bookingId: bookingId
                    };
                    const hotelDetails = await this.hotelDb.findById(bookingDetails.hotelId);
                    const userDetails = await this.userDB.findByIdAndUpdate(bookingDetails.userId, {
                        $inc: { wallet: bookingDetails.totalAmount },
                        $push: { walletTransaction: { ...walletTransaction, amountRecieved: bookingDetails.totalAmount } }
                    });
                    console.log("userDetails", userDetails);
                    const adminCommission = Math.floor(bookingDetails.totalAmount * 10 / 100);
                    const hostDebitAmount = bookingDetails.totalAmount - adminCommission;
                    await this.adminDb.updateOne({
                        "email": "admin@gmail.com",
                    }, {
                        $inc: { wallet: -adminCommission }, // Increment wallet by hostReceivableAmount
                        $push: { walletTransaction: { ...walletTransaction, type: 'Refund debited', adminCharge: adminCommission, hotelName: hotelDetails?.hotelName } }, // Add a new transaction to the walletTransaction array
                    });
                    await this.hostDb.updateOne({
                        "hotels": bookingDetails.hotelId, // Match the host by hotelId in the hotels array
                    }, {
                        $inc: { wallet: -hostDebitAmount }, // Increment wallet by hostReceivableAmount
                        $push: { walletTransaction: { ...walletTransaction, type: 'Refund debited', hostCharge: hostDebitAmount } }, // Add a new transaction to the walletTransaction array
                    });
                }
                const roomCategory = await this.roomCategoryDb.findOne({ _id: bookingDetails.roomId });
                if (!roomCategory) {
                    throw new Error("Room category not found");
                }
                // Keep track of how many objects have been removed
                let roomsUpdated = 0;
                // Iterate over each room and remove matching dates
                roomCategory.eachRoomDetails.forEach((room) => {
                    if (bookingDetails.noOfRooms && roomsUpdated >= bookingDetails.noOfRooms)
                        return;
                    // Filter out matching BookedDates
                    const initialLength = room.BookedDates.length;
                    room.set("BookedDates", room.BookedDates.filter((date) => !(date.checkIn.getTime() === bookingDetails.checkIn.getTime() &&
                        date.checkOut.getTime() === bookingDetails.checkOut.getTime())));
                    console.log('filtered Rooms', room.BookedDates);
                    const datesRemoved = initialLength - room.BookedDates.length;
                    roomsUpdated += datesRemoved;
                    console.log("roomsUpdated", roomsUpdated);
                });
                // Save the updated document
                await roomCategory.save();
                console.log("Updated RoomCategory:", roomCategory);
            }
            return "booking cancelled";
        }
        catch (error) {
            throw error;
        }
    }
    async partialRefund(bookingId) {
        try {
            const bookingDetails = await this.bookingDb.findByIdAndUpdate({ _id: bookingId }, {
                bookingStatus: "cancelled"
            }, { new: true });
            if (!bookingDetails?.checkIn || !bookingDetails?.checkOut) {
                throw new Error("Check-in and Check-out dates are required.");
            }
            if (bookingDetails && bookingDetails.totalAmount && bookingDetails.checkIn && bookingDetails.checkOut) {
                if (bookingDetails.paymentMethod === "online") {
                    await this.paymentDb.findByIdAndUpdate({ _id: bookingDetails.paymentId }, { status: "Partial-refund credited" }, { new: true });
                    const userRefundableAmount = Math.floor(bookingDetails.totalAmount * 80 / 100);
                    let walletTransaction = {
                        date: new Date(),
                        type: "Partial-refund credited",
                        totalAmount: bookingDetails.totalAmount,
                        bookingId: bookingId
                    };
                    const hotelDetails = await this.hotelDb.findById({ _id: bookingDetails.hotelId });
                    await this.userDB.findByIdAndUpdate({ _id: bookingDetails.userId }, {
                        $inc: { wallet: userRefundableAmount },
                        $push: { walletTransation: { ...walletTransaction, amountRecieved: userRefundableAmount } }
                    });
                    const adminCommission = Math.floor(bookingDetails.totalAmount * 10 / 100);
                    const adminDebitableAmount = Math.floor(adminCommission * 80 / 100);
                    const hostAmount = bookingDetails.totalAmount - adminCommission;
                    const hostDebitableAmount = Math.floor(hostAmount * 80 / 100);
                    await this.adminDb.updateOne({
                        "email": "admin@gmail.com",
                    }, {
                        $inc: { wallet: -adminDebitableAmount }, // Increment wallet by hostReceivableAmount
                        $push: { walletTransaction: { ...walletTransaction, type: 'Partial-refund debited', adminCharge: adminDebitableAmount, hotelName: hotelDetails?.hotelName } }, // Add a new transaction to the walletTransaction array
                    });
                    await this.hostDb.updateOne({
                        "hotels": new mongoose_1.default.Types.ObjectId(bookingDetails.hotelId), // Match the host by hotelId in the hotels array
                    }, {
                        $inc: { wallet: hostDebitableAmount }, // Increment wallet by hostReceivableAmount
                        $push: { walletTransaction: { ...walletTransaction, type: 'Partial-refund debited', hostCharge: hostDebitableAmount } }, // Add a new transaction to the walletTransaction array
                    });
                }
                const roomCategory = await this.roomCategoryDb.findOne({ _id: bookingDetails.roomId });
                if (!roomCategory) {
                    throw new Error("Room category not found");
                }
                // Keep track of how many objects have been removed
                let roomsUpdated = 0;
                // Iterate over each room and remove matching dates
                roomCategory.eachRoomDetails.forEach((room) => {
                    if (bookingDetails.noOfRooms && roomsUpdated >= bookingDetails.noOfRooms)
                        return;
                    // Filter out matching BookedDates
                    const initialLength = room.BookedDates.length;
                    room.set("BookedDates", room.BookedDates.filter((date) => !(date.checkIn.getTime() === bookingDetails.checkIn.getTime() &&
                        date.checkOut.getTime() === bookingDetails.checkOut.getTime())));
                    console.log('filtered Rooms', room.BookedDates);
                    const datesRemoved = initialLength - room.BookedDates.length;
                    roomsUpdated += datesRemoved;
                    console.log("roomsUpdated", roomsUpdated);
                });
                // Save the updated document
                await roomCategory.save();
                console.log("Updated RoomCategory:", roomCategory);
            }
            return "booking cancelled";
        }
        catch (error) {
            throw error;
        }
    }
    async noRefund(bookingId) {
        try {
            console.log("no refund working");
            const bookingDetails = await this.bookingDb.findByIdAndUpdate({ _id: bookingId }, {
                bookingStatus: "cancelled"
            }, { new: true });
            if (!bookingDetails?.checkIn || !bookingDetails?.checkOut) {
                throw new Error("Check-in and Check-out dates are required.");
            }
            if (bookingDetails && bookingDetails.totalAmount && bookingDetails.checkIn && bookingDetails.checkOut) {
                if (bookingDetails.paymentMethod === "online") {
                    await this.paymentDb.findByIdAndUpdate({ _id: bookingDetails.paymentId }, { status: "no refund" }, { new: true });
                }
                const roomCategory = await this.roomCategoryDb.findOne({ _id: bookingDetails.roomId });
                if (!roomCategory) {
                    throw new Error("Room category not found");
                }
                // Keep track of how many objects have been removed
                let roomsUpdated = 0;
                // Iterate over each room and remove matching dates
                roomCategory.eachRoomDetails.forEach((room) => {
                    if (bookingDetails.noOfRooms && roomsUpdated >= bookingDetails.noOfRooms)
                        return;
                    // Filter out matching BookedDates
                    const initialLength = room.BookedDates.length;
                    room.set("BookedDates", room.BookedDates.filter((date) => !(date.checkIn.getTime() === bookingDetails.checkIn.getTime() &&
                        date.checkOut.getTime() === bookingDetails.checkOut.getTime())));
                    console.log('filtered Rooms', room.BookedDates);
                    const datesRemoved = initialLength - room.BookedDates.length;
                    roomsUpdated += datesRemoved;
                    console.log("roomsUpdated", roomsUpdated);
                });
                // Save the updated document
                await roomCategory.save();
                console.log("Updated RoomCategory:", roomCategory);
            }
            return "booking cancelled";
        }
        catch (error) {
            throw error;
        }
    }
    async rateTheHotel(data) {
        try {
            if (!data.rating || !data.review || !data.bookingId || !data.userId || !data.hotelId) {
                throw new Error("All fields are required.");
            }
            // Create the rating document
            const newRating = await this.ratingDb.create({
                rating: data.rating,
                review: data.review,
                bookingId: data.bookingId,
                userId: data.userId,
                hotelId: data.hotelId
            });
            console.log("Rating saved successfully:", newRating);
            return newRating;
        }
        catch (error) {
            throw new Error("Error saving rating:");
        }
    }
    async reportHotel(data) {
        try {
            if (!data.complaint || !data.bookingId || !data.userId || !data.hotelId) {
                throw new Error("All fields are required.");
            }
            // Create the rating document
            const newComplaint = await this.reportDb.create({
                complaint: data.complaint,
                bookingId: data.bookingId,
                userId: data.userId,
                hotelId: data.hotelId,
                date: new Date()
            });
            console.log("complaint saved successfully:", newComplaint);
            return newComplaint;
        }
        catch (error) {
            throw new Error("Error saving rating:");
        }
    }
    // async notificationCountUpdater(id: string): Promise<{ count: number }> {
    //     try {
    //         const message = await messageModel.aggregate([
    //             { $match: { $and: [{ sender: "host" }, { seen: false }] } },
    //             {
    //                 $lookup: {
    //                     from: "chats",
    //                     localField: "chatId",
    //                     foreignField: "_id",
    //                     as: "chat"
    //                 }
    //             },
    //             { $match: { "chat.userId": new mongoose.Types.ObjectId(id) } }
    //         ]);
    //         return { count: message.length };
    //     } catch (error: any) {
    //         throw new customError(error.message, error.statusCode);
    //     }
    // }
    // async notificationsGetter(id: string): Promise<{
    //     notfiyData: NotifyGetterResponse[] | [];
    //     countOfUnreadMessages: UnreadMessageCount[] | [];
    // }> {
    //     try {
    //         const querynotifyData = [
    //             { $match: { userId: new mongoose.Types.ObjectId(id) } },
    //             {
    //                 $lookup: {
    //                     from: "messages",
    //                     localField: "latestMessage",
    //                     foreignField: "_id",
    //                     as: "message",
    //                 },
    //             },
    //             { $unwind: "$message" },
    //             { $match: { "message.sender": "host" } },
    //             {
    //                 $lookup: {
    //                     from: "hosts",
    //                     localField: "hostId",
    //                     foreignField: "_id",
    //                     as: "host",
    //                 },
    //             },
    //             { $unwind: "$host" },
    //             {
    //                 $project: {
    //                     hostId: 1,
    //                     userId: 1,
    //                     createdAt: 1,
    //                     updatedAt: 1,
    //                     latestMessage: 1,
    //                     message: 1,
    //                     "host.firstName": 1,
    //                     "host.profileImage": 1,
    //                 },
    //             },
    //         ];
    //         const querycountOfUnreadMessages = [
    //             {
    //                 $lookup: {
    //                     from: "chats",
    //                     localField: "chatId",
    //                     foreignField: "_id",
    //                     as: "chat",
    //                 },
    //             },
    //             { $unwind: "$chat" },
    //             {
    //                 $match: {
    //                     $and: [
    //                         { "chat.userId": new mongoose.Types.ObjectId(id) },
    //                         { sender: "host" },
    //                         { seen: false },
    //                     ],
    //                 },
    //             },
    //             { $group: { _id: "$chatId", count: { $sum: 1 } } },
    //         ];
    //         const notifyData: NotifyGetterResponse[] | [] =
    //             await chatModel.aggregate(querynotifyData);
    //         const countOfUnreadMessages: UnreadMessageCount[] | [] =
    //             await messageModel.aggregate(querycountOfUnreadMessages);
    //         return {
    //             notfiyData: notifyData,
    //             countOfUnreadMessages: countOfUnreadMessages,
    //         };
    //     } catch (error: any) {
    //         throw new customError(error.message, error.statusCode);
    //     }
    // }
    async fetchTopRatedHotels(latLng) {
        try {
            const { lat, lng } = latLng;
            const earthRadiusInMiles = 3963.2; // Radius of Earth in miles
            const maxDistanceInMiles = 50; // Search radius
            const hotels = await this.hotelDb.aggregate([
                {
                    $match: {
                        isHotelListed: "approved", // Only approved hotels
                        location: {
                            $geoWithin: {
                                $centerSphere: [[lng, lat], maxDistanceInMiles / earthRadiusInMiles]
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "ratings",
                        localField: "_id",
                        foreignField: "hotelId",
                        as: "ratings"
                    }
                },
                { $addFields: { averageRatings: { $avg: "$ratings.rating" } }
                },
                { $sort: {
                        averageRatings: -1
                    } },
                { $project: {
                        _id: 1,
                        hotelName: 1,
                        address: 1,
                        hotelPhoto: { $arrayElemAt: ["$hotelPhoto", 0] },
                        averageRatings: 1
                    } }
            ]);
            return hotels;
        }
        catch (error) {
            throw new Error("Could not fetch top-rated hotels");
        }
    }
    async fetchCoupons(city) {
        try {
            const today = new Date();
            const coupons = this.couponDb.find({ $or: [{ city }, { city: null }], validity: { $gte: today } })
                .sort({ _id: -1 });
            console.log("coupons", coupons);
            return coupons;
        }
        catch (error) {
            throw new Error("Having issue in fetching coupons");
        }
    }
    async applyCoupon(code, purchaseAmount) {
        try {
            const today = new Date();
            const response = await this.couponDb.find({ code: code, validity: { $gte: today } }, { offerPercentage: 1, minPurchase: 1, maxDiscount: 1 });
            if (response.length === 0) {
                return { message: "Invalid code" };
            }
            else {
                const coupon = response[0];
                const isTaken = await this.userDB.findOne({ coupons: coupon._id });
                if (isTaken) {
                    return { message: "coupon has already used" };
                }
                if (purchaseAmount < coupon.minPurchase) {
                    return { message: `should book hotel for atleast ${coupon.minPurchase} to apply this  coupon` };
                }
                else {
                    const discount = Math.min(coupon.maxDiscount, purchaseAmount * (coupon.offerPercentage / 100));
                    return { message: 'coupon applied', discount };
                }
            }
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
}
exports.userRepository = userRepository;
