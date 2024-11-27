"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostRepository = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hostSchema_1 = __importDefault(require("../db/models/hostSchema"));
class hostRepository {
    hostDb;
    constructor() {
        this.hostDb = hostSchema_1.default;
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
    async addHotel(data, hotelPhotos, roomPhotos, hostDetails) {
        try {
            console.log("room photos", roomPhotos);
            const { hotelName, address, latitude, longitude, totalNoOfRooms, amenities, roomCategories, roomPolicies, hotelRules, cancellationPolicy } = data;
            console.log("roomCatogery", typeof roomCategories, roomCategories);
            let parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
            let parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
            let parsedhotelRules = typeof hotelRules === 'string' ? JSON.parse(hotelRules) : hotelRules;
            // let parsedRoomAmenities = typeof roomCategories?.amenities === 'string' ? JSON.parse(roomCategories?.amenities) : roomCategories?.amenities;
            let parsedRoomPolicies = typeof roomPolicies === 'string' ? JSON.parse(roomPolicies) : roomPolicies;
            console.log("Photos", roomPhotos);
            const newHotel = {
                hotelName,
                address: parsedAddress,
                totalNoOfRooms,
                amenities: parsedAmenities,
                hotelPhoto: hotelPhotos, // Array of hotel photo filenames
                roomCategories: roomCategories.map((category) => {
                    // Parse the category JSON string into an object
                    const parsedCategory = JSON.parse(category);
                    // Find the photos for the specific roomType
                    const roomTypePhotos = roomPhotos[parsedCategory.roomType] || [];
                    // Return the new object with room photos included
                    return {
                        ...parsedCategory,
                        roomPhotos: roomTypePhotos, // Add respective room photos
                    };
                }),
                roomPolicies: parsedRoomPolicies,
                hotelRules: parsedhotelRules,
                cancellationPolicy,
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude], // Longitude first, then latitude
                },
            };
            console.log("newHotel", newHotel);
            if (!hostDetails) {
                throw new Error("Host details not found");
            }
            const savedData = await this.hostDb.findByIdAndUpdate({ _id: hostDetails?._id }, { $push: { hotels: newHotel } }, { new: true });
            const lastAddedHotel = savedData?.hotels?.[savedData.hotels.length - 1];
            console.log("Hotel successfully added hote id", lastAddedHotel?._id);
            const newlyAddedHotel = {
                hotelId: lastAddedHotel?._id,
                hotelName,
                address,
                latitude,
                longitude,
                totalNoOfRooms,
                amenities: parsedAmenities,
                hotelPhotos,
                roomCategories: roomCategories.map((category) => {
                    // Parse the category JSON string into an object
                    const parsedCategory = JSON.parse(category);
                    // Find the photos for the specific roomType
                    const roomTypePhotos = roomPhotos[parsedCategory.roomType] || [];
                    // Return the new object with room photos included
                    return {
                        ...parsedCategory,
                        roomPhotos: roomTypePhotos, // Add respective room photos
                    };
                }),
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
                {
                    $unwind: "$hotels" // Unwind the hotels array to filter individual hotels
                },
                {
                    $match: { "hotels.isHotelListed": "approved" } // Match only hotels that are approved
                },
                {
                    $group: {
                        _id: "$_id",
                        hotels: { $push: "$hotels" }
                    }
                }
            ]);
            // console.log("response aggregate", response);
            return response;
        }
        catch (error) {
            console.error("Error fetching hotels:", error);
            throw error;
        }
    }
    async addingEditedhotelData(editedData, hostId) {
        try {
            const hotelId = editedData?._id;
            const response = await this.hostDb.findOneAndUpdate({ _id: hostId, "hotels._id": hotelId }, { $set: { "hotels.$.editedData": editedData } }, { new: true });
            console.log("response aggregate", response);
            return response;
        }
        catch (error) {
            console.error("Error fetching hotels:", error);
            throw error;
        }
    }
}
exports.hostRepository = hostRepository;