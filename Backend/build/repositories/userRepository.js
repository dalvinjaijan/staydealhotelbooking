"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const userSchema_1 = __importDefault(require("../db/models/userSchema"));
const hostSchema_1 = __importDefault(require("../db/models/hostSchema"));
class userRepository {
    userDB;
    hostDb;
    constructor() {
        this.userDB = userSchema_1.default;
        this.hostDb = hostSchema_1.default;
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
            const maxDistanceInMiles = 50; // 1 mile
            const hotels = await hostSchema_1.default.aggregate([
                {
                    $unwind: "$hotels" // Unwind the hotels array to bring each hotel to the top level
                },
                {
                    $match: {
                        "hotels.isHotelListed": "approved", // Only approved hotels
                        "hotels.location": {
                            $geoWithin: {
                                $centerSphere: [[lng, lat], maxDistanceInMiles / earthRadiusInMiles]
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        hotelId: "$hotels._id",
                        hotelName: "$hotels.hotelName",
                        amenities: "$hotels.amenities",
                        totalNoOfRooms: "$hotels.totalNoOfRooms",
                        address: "$hotels.address",
                        hotelPhoto: "$hotels.hotelPhoto",
                        roomCategories: {
                            $map: {
                                input: "$hotels.roomCategories",
                                as: "category",
                                in: {
                                    roomType: "$$category.roomType",
                                    roomSize: "$$category.roomSize",
                                    noOfRooms: "$$category.noOfRooms",
                                    roomPrice: "$$category.roomPrice",
                                    roomAmenities: "$$category.roomAmenities",
                                    roomPhotos: "$$category.roomPhotos"
                                }
                            }
                        },
                        roomPolicies: "$hotels.roomPolicies",
                        hotelRules: "$hotels.hotelRules",
                        cancellationPolicy: "$hotels.cancellationPolicy",
                        "hotels.location.coordinates": 1 // Include coordinates in the result if needed
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
    async searchHotels(data) {
        try {
            const { lat, lng } = data.lngLat;
            const earthRadiusInMiles = 3963.2; // Radius of Earth in miles
            const maxDistanceInMiles = 50; // 1 mile
            const hotels = await hostSchema_1.default.aggregate([
                {
                    $unwind: "$hotels" // Unwind the hotels array to bring each hotel to the top level
                },
                {
                    $match: {
                        "hotels.isHotelListed": "approved", // Only approved hotels
                        "hotels.location": {
                            $geoWithin: {
                                $centerSphere: [[lng, lat], maxDistanceInMiles / earthRadiusInMiles]
                            }
                        },
                        "hotels.hotelName": { $regex: `^${data.searchInput}`, $options: "i" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        hotelId: "$hotels._id",
                        hotelName: "$hotels.hotelName",
                        amenities: "$hotels.amenities",
                        totalNoOfRooms: "$hotels.totalNoOfRooms",
                        address: "$hotels.address",
                        hotelPhoto: "$hotels.hotelPhoto",
                        roomCategories: {
                            $map: {
                                input: "$hotels.roomCategories",
                                as: "category",
                                in: {
                                    roomType: "$$category.roomType",
                                    roomSize: "$$category.roomSize",
                                    noOfRooms: "$$category.noOfRooms",
                                    roomPrice: "$$category.roomPrice",
                                    roomAmenities: "$$category.roomAmenities",
                                    roomPhotos: "$$category.roomPhotos"
                                }
                            }
                        },
                        roomPolicies: "$hotels.roomPolicies",
                        hotelRules: "$hotels.hotelRules",
                        cancellationPolicy: "$hotels.cancellationPolicy",
                        "hotels.location.coordinates": 1 // Include coordinates in the result if needed
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
                "hotels.roomCategories.roomType": { $in: data.roomTypes }
            } : {};
            console.log("roomTypeFilter", roomTypeFilter);
            // Create other filters (e.g., "Couple friendly", "Pet friendly") to match any in hotelRules
            const otherFilter = data.otherFilters.length > 0 ? {
                "hotels.hotelRules": { $in: data.otherFilters }
            } : {};
            console.log("otherFilter", otherFilter);
            const hotels = await hostSchema_1.default.aggregate([
                {
                    $unwind: "$hotels" // Unwind hotels array
                },
                {
                    $match: {
                        "hotels.isHotelListed": "approved", // Only approved hotels
                        // Geo location filter within 50 miles
                        "hotels.location": {
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
                        hotelId: "$hotels._id",
                        hotelName: "$hotels.hotelName",
                        amenities: "$hotels.amenities",
                        totalNoOfRooms: "$hotels.totalNoOfRooms",
                        address: "$hotels.address",
                        hotelPhoto: "$hotels.hotelPhoto",
                        roomCategories: {
                            $map: {
                                input: "$hotels.roomCategories",
                                as: "category",
                                in: {
                                    roomType: "$$category.roomType",
                                    roomSize: "$$category.roomSize",
                                    noOfRooms: "$$category.noOfRooms",
                                    roomPrice: "$$category.roomPrice",
                                    roomAmenities: "$$category.roomAmenities",
                                    roomPhotos: "$$category.roomPhotos"
                                }
                            }
                        },
                        roomPolicies: "$hotels.roomPolicies",
                        hotelRules: "$hotels.hotelRules",
                        cancellationPolicy: "$hotels.cancellationPolicy",
                        "hotels.location.coordinates": 1 // Include coordinates if needed
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
}
exports.userRepository = userRepository;
