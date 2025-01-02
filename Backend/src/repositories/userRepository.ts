import mongoose, { Types } from 'mongoose'
import { dataForBookingHotel, filterHotelsData, searchHotelsData, userRepositoryInterface } from '../Adapters/interfaces/userInterface/iUserRepositoryInterface'
import UserSchema from '../db/models/userSchema'
import Host from '../db/models/hostSchema'
import Hotel from '../db/models/hotelSchema'
import { bookingHotelDetails } from '../Adapters/interfaces/userInterface/iUserInteractor'
import RoomCategory from '../db/models/roomSchema'
import Payment from '../db/models/paymentSchema'
import Booking from '../db/models/bookingSchema'
import { sendInvoice } from '../Utils/invoiceEmail'

export class userRepository implements userRepositoryInterface {
    private userDB: typeof UserSchema
    private hostDb: typeof Host
    private hotelDb: typeof Hotel
    private roomCategoryDb:typeof RoomCategory
    private paymentDb:typeof Payment
    private bookingDb:typeof Booking


    constructor() {
        this.userDB = UserSchema
        this.hostDb = Host
        this.hotelDb = Hotel
        this.roomCategoryDb=RoomCategory
        this.paymentDb=Payment
        this.bookingDb=Booking
    }
    async findUserByEmail(email: string): Promise<any> {
        const userExists = await this.userDB.findOne({ email: email })
        if (userExists) {
            const userId = userExists._id
            return userId
        }
    }
    async getUserDetails(email: string): Promise<any> {
        const userExists = await this.userDB.findOne({ email: email })
    //   console.log("userDetails",userExists,typeof userExists)
      return userExists
    }
    async createUser(email: string): Promise<Types.ObjectId> {
        try {
            const newUser = new this.userDB({ email });

            await newUser.save();
            return newUser._id
        } catch (error) {
            throw new Error('Error creating new user');
        }
    }

    async findUserById(userId: string): Promise<any> {
        try {
            const user = await this.userDB.findOne({ _id: userId })
            // console.log("userExist profile-->",user);
            return user

        } catch (error) {

        }
    }
    async saveUserDetails(user: any, userDetails: any, profileImage: string): Promise<any> {
        try {
            const { email, firstName, lastName, dob, phone } = userDetails
            user.email = email
            user.firstName = firstName
            user.lastName = lastName
            user.dob = dob
            user.phone = phone
            if (profileImage) {
                user.profileImage = profileImage;
            }
            user.save()
            console.log("savinguser->", user)

        } catch (error) {
            throw new Error('Failed to save user details');
        }
    }

    async fetchNearByHotels(lat: number, lng: number): Promise<any> {
        try {
            const earthRadiusInMiles = 3963.2; // Radius of Earth in miles
            const maxDistanceInMiles = 50; // 1 mile

            const hotels = await Hotel.aggregate([
              
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
                        from: "roomcategories",
                        localField: "roomCategories", 
                        foreignField: "_id",
                        as: "roomCategoryDetails" 
                    }
                },
                {
                    $project: {
                        _id:0,
                        hotelId:"$_id",
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


            console.log("hotels listed",hotels);
            return hotels
        } catch (error) {
            throw error
        }
    }

    async searchHotels(data:searchHotelsData): Promise<any> {
        try {
            const{lat,lng}=data.lngLat
            const earthRadiusInMiles = 3963.2; // Radius of Earth in miles
            const maxDistanceInMiles = 50; // 1 mile

            const hotels = await Hotel.aggregate([
            
                {
                    $match: {
                        isHotelListed: "approved", // Only approved hotels

                        location: {
                            $geoWithin: {
                                $centerSphere: [[lng, lat], maxDistanceInMiles / earthRadiusInMiles]
                            }
                        },
                        hotelName: { $regex: `^${data.searchInput}`, $options: "i" } 
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
                        _id:0,
                        hotelId:"$_id",
                        hotelName: "$hotelName",
                        amenities: "$amenities",
                        totalNoOfRooms: "$totalNoOfRooms",
                        address: "$address",
                        hotelPhoto: "$hotelPhoto",
                        roomCategories:"$roomCategoryDetails",
                        roomPolicies: "$roomPolicies",
                        hotelRules: "$hotelRules",
                        cancellationPolicy: "$cancellationPolicy",
                        "location.coordinates": 1 // Include coordinates in the result if needed
                    }
                }
            ]);


            console.log("hotels listed",hotels);
            return hotels
        } catch (error) {
            throw error
        }
    }

    async fetchFilteredHotels(data: filterHotelsData): Promise<any> {
        try {
            const { lat, lng } = data.lngLat;
            const earthRadiusInMiles = 3963.2; // Radius of Earth in miles
            const maxDistanceInMiles = 50; // Max distance in miles
    
            // Create room type filter to match any of the selected room types
            const roomTypeFilter = data.roomTypes.length > 0 ? {
                "roomCategoryDetails.roomType": { $in: data.roomTypes }
            } : {};
            console.log("roomTypeFilter",roomTypeFilter)
    
            // Create other filters (e.g., "Couple friendly", "Pet friendly") to match any in hotelRules
            const otherFilter = data.otherFilters.length > 0 ? {
                hotelRules: { $in: data.otherFilters }
            } : {};
            console.log("otherFilter",otherFilter)

    
            const hotels = await Hotel.aggregate([
                {
                    $lookup:{
                        from :"roomcategories",
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
                        roomCategories: "$roomCategoryDetails" ,
                        roomPolicies: "$roomPolicies",
                        hotelRules: "$hotelRules",
                        cancellationPolicy: "$cancellationPolicy",
                        "location.coordinates": 1 // Include coordinates if needed
                    }
                }
            ]);
    
            console.log("Filtered hotels:", hotels);
            return hotels;
        } catch (error) {
            throw error;
        }
    }


    async getHotelDetails(data:dataForBookingHotel): Promise<any> {
        try {
            const{lat,lng}=data.lngLat
            const {checkIn,checkOut,numberOfRooms}=data
            const earthRadiusInMiles = 3963.2; // Radius of Earth in miles
            const maxDistanceInMiles = 50; // 1 mile
            const searchData=data.searchTerm.split(",")
            const hotelname=searchData.splice(0,1)
            const hotelName=hotelname.join('')
            const address=searchData.join(',')
            console.log("hotelName",hotelName,address)


            const hotels = await Hotel.aggregate([
            
                {
                    $match: {
                        isHotelListed: "approved", // Only approved hotels

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
                                // { 
                                    $gte: [
                                        { 
                                            $subtract: [
                                                "$roomCategoryDetails.noOfRooms",
                                                { $ifNull: [{ $arrayElemAt: ["$bookedRooms.bookedRooms", 0] }, 0] }
                                            ]
                                        },
                                        numberOfRooms
                                    ]
                                // },
                                // { $eq: ["$roomCategoryDetails._id",  new mongoose.Types.ObjectId(roomId)] },
                            // ],
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
                    },
                },
            ]);
    
            // Filter room categories to only include those with availability
            hotels.forEach((hotel) => {
               return hotel.roomCategories = hotel.roomCategories.filter((roomCategory:any) => roomCategory.isAvailable );
            });
    


            console.log("hotels listed",hotels); 
            return hotels
        } catch (error) {
            throw error
        }
    }

    async fetchHotelDetails(data: dataForBookingHotel): Promise<any> {
        try {
            const { lat, lng } = data.lngLat;
            const earthRadiusInMiles = 3963.2; // Radius of Earth in miles
            const maxDistanceInMiles = 50; // Search radius
            const { checkIn, checkOut, hotelId, roomId, numberOfRooms } = data;
            console.log("object",typeof numberOfRooms,numberOfRooms)
           
    
            const hotels = await Hotel.aggregate([
                {
                    $match: {
                        isHotelListed: "approved", // Only approved hotels
                        location: {
                            $geoWithin: {
                                $centerSphere: [[lng, lat], maxDistanceInMiles / earthRadiusInMiles],
                            },
                        },
                        _id: new mongoose.Types.ObjectId(hotelId),
                    },
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
                    },
                },
            ]);
    
            // Filter room categories to only include those with availability
            hotels.map((hotel) => {
                return hotel.roomCategories = hotel.roomCategories.filter((roomCategory:any) => roomCategory.isAvailable );
            });
    
            console.log("Hotels listed:", JSON.stringify(hotels[0].roomCategories));
            return hotels;
        } catch (error) {
            console.error("Error fetching hotel details:", error);
            throw error;
        }
    }

    async reserveRoom(bookingDetails: bookingHotelDetails): Promise<any> {
        try {
          // Find the room category
           // Convert checkIn and checkOut to Date objects
    const checkInDate = new Date(bookingDetails.checkIn);
    const checkOutDate = new Date(bookingDetails.checkOut);

    // Find the room category
    const roomCategory = await RoomCategory.findById(bookingDetails.roomId).exec(); 
    if (!roomCategory) {
      throw new Error("Room category not found.");
    }

    // await Promise.all(
    //     roomCategory.eachRoomDetails.map(async (room) => {
    //       room.BookedDates = room.BookedDates.filter((bookedDate) => {
    //         if (bookedDate.checkOut < currentDate) {
    //           return false; // Exclude past booked dates
    //         }
    //         return true; 
    //       });
    //       await room.save(); // Save the updated room after removing past booked dates
    //     })
    //   );

    // Filter available rooms directly
    const availableRooms = roomCategory.eachRoomDetails.filter((room) => {
      return room.isListed && 
             room.BookedDates.every((bookedDate) => {
               return !(
                 (checkInDate < bookedDate.checkOut && checkInDate >= bookedDate.checkIn) ||
                 (checkOutDate > bookedDate.checkOut && checkOutDate <= bookedDate.checkIn) ||
                 (checkInDate <= bookedDate.checkIn && checkOutDate >= bookedDate.checkOut)
               );
             });
    });

    if (availableRooms.length < bookingDetails.numberOfRooms) {
      throw new Error("Not enough available rooms.");
    }
          // Process payment (if applicable)
          let paymentId = null;
          if (bookingDetails.paymentMethod === "online") {
            // Assuming you have a Payment model
            const payment = new Payment({
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
      
          // Assuming you have a Booking model and a Hotel model
          const booking = new Booking({
            bookingId: new mongoose.Types.ObjectId().toString(),
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
            const hotel = await Hotel.findById(bookingDetails.hotelId);
            if (hotel) {
              const emailDataForBooking = {
                bookingId: savedBooking.bookingId,
                hotelName: hotel.hotelName,
                address: hotel.address, 
                roomNumbers: reservedRoomNumbers,
                checkIn: bookingDetails.checkIn,
                checkOut: bookingDetails.checkOut,
                hotelRules: hotel.hotelRules, 
              };
              sendInvoice(bookingDetails.email, emailDataForBooking); 
            }
          }
      
          return {
            success: true,
            message: "Room reserved successfully.",
            booking: savedBooking,
            reservedRoomNumbers,
          };
      
        } catch (error) {
          throw error;
        }
      }


    // async reserveRoom(bookingDetails: bookingHotelDetails): Promise<any> {
    //     try {
    //         // Check if rooms are available
    //         const roomCategory = await RoomCategory.findById(bookingDetails.roomId);
    //         if (!roomCategory) {
    //           throw new Error("Room category not found.");
    //         }
      
    //         const availableRooms = roomCategory.eachRoomDetails.filter(
    //           (room) => !room.isBooked && room.isListed
    //         );
    //         console.log("availableRoom",availableRooms)
      
    //         if (availableRooms.length < bookingDetails.numberOfRooms) {
    //           throw new Error("Not enough available rooms.");
    //         }
      
    //         let paymentId = null;
      
    //         if (bookingDetails.paymentMethod === "online") {
    //           // Verify payment ID and save payment details
    //           const payment = new Payment({
    //             paymentId: bookingDetails.paymentId,
    //             userId: bookingDetails.userId,
    //             hotelId: bookingDetails.hotelId,
    //             roomId: bookingDetails.roomId,
    //             TotalAmount: bookingDetails.totalAmount,
    //             paymentMethod: "online",
    //             status: "paid",
    //             paidOn: new Date(),
    //           });
      
    //           const savedPayment = await payment.save();
    //           paymentId = savedPayment._id;
    //         }
      
    //         // Reserve rooms
    //         const reservedRoomNumbers: string[] = [];
    //         for (let i = 0; i < bookingDetails.numberOfRooms; i++) {
    //           const roomToReserve = availableRooms[i];
    //           roomToReserve.isBooked = true;
    //           reservedRoomNumbers.push(roomToReserve.roomNumber);
    //         }
      
    //         await roomCategory.save();
    //         let GuestDetails={
    //             name:bookingDetails.name,
    //             email:bookingDetails.email,
    //             phone:bookingDetails.phone,
    //             country:bookingDetails.country
                
    //         }
      
    //         // Create booking
    //         const booking = new Booking({
    //           bookingId: new mongoose.Types.ObjectId().toString(),
    //           userId: bookingDetails.userId,
    //           checkIn: bookingDetails.checkIn,
    //           checkOut: bookingDetails.checkOut,
    //           hotelId: bookingDetails.hotelId,
    //           roomId: bookingDetails.roomId,
    //           paymentMethod: bookingDetails.paymentMethod,
    //           paymentId,
    //           noOfGuests: bookingDetails.guestNumber,
    //           noOfRooms: bookingDetails.numberOfRooms,
    //           roomNumbers:reservedRoomNumbers,
    //           totalAmount: bookingDetails.totalAmount,
    //           GuestDetails,
    //         });

    //         const hotel=await Hotel.findOne({_id:new mongoose.Types.ObjectId(booking.hotelId)})

      
    //         const savedBooking = await booking.save();
    //         if(booking?.bookingId && hotel?.hotelName && hotel?.hotelName && hotel?.address && reservedRoomNumbers && booking.checkIn && booking.checkOut && hotel?.hotelRules){
    //             const emailDataForBooking = {
    //                 bookingId: booking?.bookingId, 
    //                 hotelName: hotel?.hotelName, 
    //                 address:hotel?.address, 
    //                 roomNumbers:reservedRoomNumbers, 
    //                 checkIn:booking.checkIn, 
    //                 checkOut:booking.checkOut, 
    //                 hotelRules:hotel?.hotelRules,
    //             }
    //         sendInvoice(GuestDetails.email,emailDataForBooking)


    //         }
           



      
    //         return {
    //           success: true,
    //           message: "Room reserved successfully.",
    //           booking: savedBooking,
    //           reservedRoomNumbers,
    //         };
            
    //     } catch (error) {
    //        throw error 
    //     }
    // }


    async getUpcomingOrders(userId: string): Promise<any> {
        try {
           
            const currentDate = new Date();
            const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0)); 
            console.log("currentDate",currentDate)
        
            const upcomingBookings = await Booking.find({
              userId, 
              checkIn: { $gte: startOfToday }, 
            })
              .populate("hotelId", "hotelName hotelPhoto") 
              .populate("roomId", "roomType") 
              .exec();
              console.log("upcomingBookings",upcomingBookings)
        
            return upcomingBookings;
          } catch (error) {
            console.error("Error fetching upcoming bookings:", error);
            throw new Error("Unable to fetch upcoming bookings.");
          }
        }

        async getCompletedOrders(userId: string): Promise<any> {
            try {
               
                const currentDate = new Date();
            
                const completedBookings = await Booking.find({
                  userId, 
                  checkOut: { $lt: currentDate }, 
                })
                  .populate("hotelId", "hotelName hotelPhoto") 
                  .populate("roomId", "roomType") 
                  .exec();
                  console.log("completedBookings",completedBookings)
            
                return completedBookings;
              } catch (error) {
                console.error("Error fetching upcoming bookings:", error);
                throw new Error("Unable to fetch upcoming bookings.");
              }
            }
        
    
    
}