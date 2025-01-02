"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostRepository = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hostSchema_1 = __importDefault(require("../db/models/hostSchema"));
const hotelSchema_1 = __importDefault(require("../db/models/hotelSchema"));
const roomSchema_1 = __importDefault(require("../db/models/roomSchema"));
class hostRepository {
    hostDb;
    hotelDb;
    roomCategoryDb;
    constructor() {
        this.hostDb = hostSchema_1.default;
        this.hotelDb = hotelSchema_1.default;
        this.roomCategoryDb = roomSchema_1.default;
    }
    async createHost(hostDetails) {
        const { firstName, lastName, email, phone, password } = hostDetails;
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newHost = new this.hostDb({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword
        });
        const savedHost = await newHost.save();
        return savedHost._id;
    }
    async findHostByEmail(email) {
        const hostExists = await this.hostDb.findOne({ email: email });
        if (hostExists) {
            return hostExists;
        }
        else {
            return null;
        }
    }
    async findHostById(hostId) {
        console.log("id", hostId);
        const hostDetails = await this.hostDb.findOne({ _id: hostId }).exec();
        ;
        return hostDetails;
    }
    async addHotel(data, hostId, hotelPhotos, roomPhotos) {
        try {
            console.log("room photos", roomPhotos);
            const { hotelName, address, latitude, longitude, totalNoOfRooms, amenities, roomCategories, roomPolicies, hotelRules, cancellationPolicy } = data;
            console.log("roomCatogery", typeof roomCategories, roomCategories);
            let parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
            let parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
            let parsedhotelRules = typeof hotelRules === 'string' ? JSON.parse(hotelRules) : hotelRules;
            // let parsedRoomAmenities = typeof roomCategories?.amenities === 'string' ? JSON.parse(roomCategories?.amenities) : roomCategories?.amenities;
            let parsedRoomPolicies = typeof roomPolicies === 'string' ? JSON.parse(roomPolicies) : roomPolicies;
            const roomCatogeryIds = await Promise.all(roomCategories.map(async (category) => {
                const parsedCategory = JSON.parse(category);
                const roomSize = parsedCategory.roomSize || 0;
                const roomTypePhotos = roomPhotos[parsedCategory.roomType] || []; // Add photos
                const roomTypeInitial = parsedCategory.roomType?.charAt(0)?.toUpperCase() || 'R'; // Default to 'R' if roomType is not provided
                const numberOfRooms = parsedCategory.noOfRooms || 0;
                // Generate eachRoomDetails array
                const eachRoomDetails = Array.from({ length: numberOfRooms }, (_, index) => ({
                    roomNumber: `${roomTypeInitial}${101 + index}`,
                    isListed: true,
                    isBooked: []
                }));
                const newRoomCategory = await this.roomCategoryDb.create({
                    ...parsedCategory,
                    roomSize: roomSize + " sqft",
                    roomPhotos: roomTypePhotos,
                    eachRoomDetails,
                    hostId
                });
                return newRoomCategory._id;
            }));
            console.log("Photos", roomPhotos);
            const newHotel = {
                hostId,
                hotelName,
                address: parsedAddress,
                totalNoOfRooms,
                amenities: parsedAmenities,
                hotelPhoto: hotelPhotos, // Array of hotel photo filenames
                roomCategories: roomCatogeryIds,
                roomPolicies: parsedRoomPolicies,
                hotelRules: parsedhotelRules,
                cancellationPolicy,
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude], // Longitude first, then latitude
                },
            };
            console.log("newHotel", newHotel);
            const hostDetails = await this.hostDb.findById(hostId);
            if (!hostDetails) {
                throw new Error("Host details not found");
            }
            const savedHotel = await this.hotelDb.create(newHotel);
            hostDetails.hotels.push(savedHotel._id);
            await hostDetails.save();
            console.log("Hotel successfully added hote id", savedHotel?._id);
            await Promise.all(roomCatogeryIds.map(async (categoryId) => {
                await this.roomCategoryDb.findByIdAndUpdate(categoryId, {
                    hotelId: savedHotel._id,
                });
            }));
            const newlyAddedHotel = {
                hotelId: savedHotel?._id,
                hotelName,
                address,
                latitude,
                longitude,
                totalNoOfRooms,
                amenities: parsedAmenities,
                hotelPhotos,
                roomCategories: roomCatogeryIds,
                roomPolicies,
                hotelRules,
                cancellationPolicy
            };
            return { success: true, message: "Request for adding hotel is sent", newlyAddedHotel };
        }
        catch (error) {
            console.error("Error adding hotel: ", error);
            return { success: false, message: error.message };
        }
    }
    async fetchHotels(hostId) {
        try {
            const response = await this.hostDb.aggregate([
                {
                    $match: { _id: new mongoose_1.Types.ObjectId(hostId) }
                },
                { $lookup: {
                        from: "hotels",
                        localField: "hotels",
                        foreignField: "_id",
                        as: "hotelDetails"
                    } },
                { $unwind: "$hotelDetails" },
                { $match: { "hotelDetails.isHotelListed": "approved" } },
                {
                    $lookup: {
                        from: "roomcategories",
                        localField: "hotelDetails.roomCategories",
                        foreignField: "_id",
                        as: "hotelDetails.roomCategories"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        hotels: { $push: "$hotelDetails" }
                    }
                }
            ]);
            console.log("response aggregate", response);
            return response;
        }
        catch (error) {
            console.error("Error fetching hotels:", error);
            throw error;
        }
    }
    async addingEditedhotelData(editedData, hostId) {
        try {
            const response = await this.hotelDb.findOneAndUpdate({ _id: editedData._id }, { $set: { editedData } }, { new: true });
            console.log("Updated Hotel Data:", response);
            return response;
        }
        catch (error) {
            console.error("Error fetching hotels:", error);
            throw error;
        }
    }
}
exports.hostRepository = hostRepository;
