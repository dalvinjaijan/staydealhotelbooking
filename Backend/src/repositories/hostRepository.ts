import mongoose, { Types } from 'mongoose'
import bcrypt from 'bcryptjs'
import { HostDocument, HostInterface, hostRepositoryInterface, NotifyGetterResponse, UnreadMessageCount } from '../Adapters/interfaces/hostInterface/iHostRepository'
import Host from '../db/models/hostSchema'
import Hotel from '../db/models/hotelSchema'
import RoomCategory from '../db/models/roomSchema'
import Booking from '../db/models/bookingSchema'
import messageModel from '../db/models/messageSchema'
import { customError } from '../Adapters/middlewares/errorHandling'
import chatModel from '../db/models/chatSchema'

export class hostRepository implements hostRepositoryInterface{
    private hostDb:typeof Host
    private hotelDb:typeof Hotel
    private roomCategoryDb:typeof RoomCategory
    private bookingDb:typeof Booking



    constructor(){
        this.hostDb=Host
        this.hotelDb=Hotel
        this.roomCategoryDb=RoomCategory
        this.bookingDb=Booking

    }
    async createHost(hostDetails: any): Promise<Types.ObjectId> {
        const {firstName,lastName,email,phone,password}=hostDetails
       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 
    
        
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

    async findHostByEmail(email: string): Promise<any> {
        const hostExists=await this.hostDb.findOne({email:email})
        if(hostExists){
            
            return hostExists
        }else{
            return null
        }
    }
    async findHostById(hostId: string): Promise<HostDocument> {
        console.log("id",hostId)
        const hostDetails = await this.hostDb.findOne({ _id: hostId }).exec() as HostDocument;;
        return hostDetails; 
    }

    async addHotel(data:any,hostId:string, hotelPhotos: string[], roomPhotos: { [key: string]: string[] }): Promise<any> {
        try {
           
            console.log("room photos",roomPhotos)
            
            const {hotelName,address,latitude,longitude,totalNoOfRooms,amenities,roomCategories,roomPolicies,hotelRules,cancellationPolicy}=data
            console.log("roomCatogery",typeof roomCategories,roomCategories)
            let parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
            
            let parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
            let parsedhotelRules = typeof hotelRules === 'string' ? JSON.parse(hotelRules) : hotelRules;
            // let parsedRoomAmenities = typeof roomCategories?.amenities === 'string' ? JSON.parse(roomCategories?.amenities) : roomCategories?.amenities;



            
            let parsedRoomPolicies = typeof roomPolicies === 'string' ? JSON.parse(roomPolicies) : roomPolicies;
           
           const roomCatogeryIds:mongoose.Types.ObjectId[]= await Promise.all(
            roomCategories.map(async (category: string) => {
              const parsedCategory = JSON.parse(category);
              const roomSize=parsedCategory.roomSize || 0;
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
                roomSize:roomSize+" sqft",
                roomPhotos: roomTypePhotos,
                eachRoomDetails,
                hostId
                
              });
              return newRoomCategory._id;
            })
          );

            console.log("Photos",roomPhotos)
            const newHotel = {
                hostId,
                hotelName,
                address:parsedAddress,
                totalNoOfRooms,
                amenities:parsedAmenities,
                hotelPhoto: hotelPhotos, // Array of hotel photo filenames
                roomCategories:roomCatogeryIds,
                roomPolicies:parsedRoomPolicies,
                hotelRules:parsedhotelRules,
                cancellationPolicy,
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude], // Longitude first, then latitude
                  },
            };
            console.log("newHotel",newHotel)
            const hostDetails=await this.hostDb.findById(hostId)
    
            if (!hostDetails) {
                throw new Error("Host details not found");
            }
    
           
            const savedHotel = await this.hotelDb.create(newHotel);
            
            hostDetails.hotels.push(savedHotel._id);
            await hostDetails.save();
           
            
            console.log("Hotel successfully added hote id",savedHotel?._id);

            await Promise.all(
                roomCatogeryIds.map(async (categoryId:any) => {
                  await this.roomCategoryDb.findByIdAndUpdate(categoryId, {
                    hotelId: savedHotel._id,
                  });
                })
              );
            const newlyAddedHotel={
                hotelId:savedHotel?._id,
                hotelName,
                address,
                latitude,
                longitude,
                totalNoOfRooms,
                amenities:parsedAmenities,
                hotelPhotos,
                roomCategories: roomCatogeryIds,
                roomPolicies,
                hotelRules,
                cancellationPolicy

            }

            return { success: true, message: "Request for adding hotel is sent",newlyAddedHotel};
        } catch (error:any) {
            console.error("Error adding hotel: ", error);
            return { success: false, message: error.message };
        } 
    }

    async fetchHotels(hostId: any) {
        try {
            const response = await this.hostDb.aggregate([
                { 
                    $match: { _id: new Types.ObjectId(hostId) } 
                },
                {$lookup: {
                    from:"hotels",
                    localField:"hotels",
                    foreignField:"_id",
                    as:"hotelDetails"
                  }},
                    { $unwind: "$hotelDetails" },
                    { $match: { "hotelDetails.isHotelListed": "approved"}},
                    {
                        $lookup: {
                            from: "roomcategories", 
                            localField: "hotelDetails.roomCategories", 
                            foreignField: "_id",
                            as: "hotelDetails.roomCategories"
                        }
                    },
                { 
                    $group: { // Group the results back by host _id and array the approved hotels
                        _id: "$_id",
                        hotels: { $push: "$hotelDetails" }
                    }
                }
            ]);
    
            console.log("response aggregate", response);
            return response;
        } catch (error) {
            console.error("Error fetching hotels:", error);
            throw error;
        }
    }
 

    async addingEditedhotelData(editedData: any, hostId: string): Promise<any> {
        try {
            const response = await this.hotelDb.findOneAndUpdate(
                { _id: editedData._id },
                { $set: { editedData } },
                { new: true }
            );
    
            console.log("Updated Hotel Data:", response);
            return response;
        } catch (error) {
            console.error("Error fetching hotels:", error);
            throw error;
        }
    }

    async fetchProfileDetails(hostId: string): Promise<any> {
        try {
            const response = await this.hostDb.findOne(
                { _id: hostId},
                { walletTransaction:0,_id:0,password:0,hotels:0 },
               
            );
    
            console.log("hostProfile Details:", response);
            return response;
        } catch (error) {
            console.error("Error fetching hotels:", error);
            throw error;
        }
    }

    async fetchWalletTransactions(hostId: string): Promise<any> {
        try {
            const response=await this.hostDb.findOne({_id:hostId},'walletTransaction')
            console.log("esponse",response)
            return response
        } catch (error) {
           throw new Error("unable to fetch transactions") 
        }
    }


    async fetchYearlyBookings(hostId:string): Promise<any> {
        try {
            const hostDetails=await this.hostDb.findById(hostId)
            console.log("hostDetails",hostDetails?.hotels)
            
           const today=new Date()
           const yearStarting= new Date(today) 
           yearStarting.setMonth(0)
           yearStarting.setDate(1)
           yearStarting.setUTCHours(0)
           yearStarting.setUTCMinutes(0)
           yearStarting.setUTCSeconds(0)
           console.log(yearStarting)
           let yearlyDates=[]
           for(let i=9;i>=0;i--){
             const year=new Date(yearStarting)
             year.setFullYear(year.getFullYear()-i)
         
             yearlyDates.push({year:year})
           }
         
     
         
          
          let yearDates=[]
           for(let i=0;i<10;i++){
            if(hostDetails){
                const saleYear=await this.bookingDb.aggregate([
                    {$match:{bookedAt:
                  {
                    $gte:yearlyDates[i].year,
                    $lte:yearlyDates[i+1] ? yearlyDates[i+1].year : new Date()
                  }}},
                  {$match:{bookingStatus:'booked',hotelId:{$in:hostDetails.hotels}}}
                  ,{
                    $group:{
                      _id:null,
                     noOfBookingPerYear: { $sum:1}
                     },
                     
                    
                    },
                    {$project:{_id:0,noOfBookingPerYear:1}}
                
                  ])
                  yearDates.push({saleYear,year:yearlyDates[i].year})
            }

           }
            console.log("yearDateData",yearDates)
            return yearDates
           
         
        
         
        } catch (error) {
         throw new Error("Error fetching Yearly bookings");
         
        }
      }
     
      async fetchMonthlyBookings(hostId:string): Promise<any> {
       try {
        const hostDetails=await this.hostDb.findById(hostId)
           const today=new Date()
           const monthStart=new Date(today)
           monthStart.setDate(1)
           monthStart.setUTCHours(0)
           monthStart.setUTCMinutes(0)   
           monthStart.setUTCSeconds(0)
           console.log(monthStart,"monthStart");   
           let monthlyDates=[]
           for(let i=1;i<=12;i++){
             const month=new Date(monthStart)
             month.setMonth(month.getMonth()-(12-i))
            const monthName = month.toLocaleString('default', { month: 'long' });
             
             monthlyDates.push({month:month,monthName:monthName})
           }
     
       let salesData = [];
     if(hostDetails){
        for (let i = 0; i < 12; i++) {
            const saleMonth= await this.bookingDb.aggregate([
               {
                 $match: {
                   
                   bookedAt: {
                     $gte: monthlyDates[i].month,
                     $lte: monthlyDates[i + 1] ? monthlyDates[i + 1].month: new Date()
                   }
                 }
               },
               {$match:{bookingStatus:'booked',hotelId:{$in:hostDetails.hotels}}},
               {
                 $group: {
                   _id: null, // or any other grouping criteria you need
                   monthlySalesData: { $sum: 1 },
                  
                 }
               },
               {$project:{
                 _id:0,
                 monthlySalesData:1
               }}
             ]);
             console.log("salemonth",saleMonth);
             salesData.push({saleMonth,monthName:monthlyDates[i].monthName});
             }
     }

     
         console.log("salesData",salesData) ;
         return salesData
     
       } catch (error) {
        throw new Error("Error fetching Monthly bookings");
        
       }
     }
     async fetchDailyBookings(hostId:string): Promise<any> {
       try {
        const hostDetails=await this.hostDb.findById(hostId)
        const today=new Date()
        today.setUTCHours(0)
           today.setUTCMinutes(0)
           today.setUTCSeconds(0)
        const dailyDates=[]
       
        for(let i=6;i>=0;i--){
         const date = new Date(today);
         date.setDate(date.getDate() - i);
         dailyDates.push({date:date})
        }
        console.log("dates",dailyDates)
     
        let salesData=[]
        if(hostDetails){
            for(let i=0;i<7;i++){
                const saleDay=await this.bookingDb.aggregate([
                  {$match:{bookedAt:
                {
                  $gte:dailyDates[i].date,
                  $lte:dailyDates[i+1] ? dailyDates[i+1].date : new Date()
                }}},
                {$match:{bookingStatus:'booked',hotelId:{$in:hostDetails.hotels}}}
                ,{
                  $group:{
                    _id:null,
                   noOfBookingPerDay: { $sum:1}
                   },
                   
                  
                  },
                  {$project:{_id:0,noOfBookingPerDay:1}}
              
                ])
                salesData.push({saleDay,day:dailyDates[i].date})
              }
                
        }
         console.log("salesData",salesData)
         return salesData
        
       } catch (error) {
        throw new Error("Error fetching Daily bookings");
        
       }
     }
     async fetchPieReport(hostId: string): Promise<any> {
      try {
          const result = await Host.aggregate([
              {
                  $match: { _id: new mongoose.Types.ObjectId(hostId) }
              },
              {
                  $lookup: {
                      from: "hotels",
                      localField: "hotels",
                      foreignField: "_id",
                      as: "hotelDetails"
                  }
              },
              {
                  $unwind: "$hotelDetails"
              },
              {
                  $lookup: {
                      from: "bookings",
                      localField: "hotelDetails._id",
                      foreignField: "hotelId",
                      as: "bookings"
                  }
              },
              {
                  $group: {
                      _id: "$hotelDetails._id",
                      hotelName: { $first: "$hotelDetails.hotelName" },
                      bookingCount: { $sum: { $size: "$bookings" } }
                  }
              },
              {
                  $project: {
                      _id: 0,
                      hotelId: "$_id",
                      hotelName: 1,
                      bookingCount: 1
                  }
              }
          ]);
  console.log("result",result)
          return result;
      } catch (error) {
          console.error("Error fetching report:", error);
          throw new Error("Error fetching report");
      }
  }
  

  async getUpcomingOrders(hostId: string): Promise<any> {
    try {
        const currentDate = new Date();
        const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));

        // Find all hotel IDs belonging to the given host
        const hotels = await Hotel.find({ hostId }).select("_id");
        const hotelIds = hotels.map(hotel => hotel._id);

        // Find bookings for those hotels
        const upcomingBookings = await Booking.find({
            hotelId: { $in: hotelIds },
            checkIn: { $gte: startOfToday },
        })
        .populate({
            path: "hotelId",
            select: "hotelName hotelPhoto roomPolicies"
        })
        .populate("roomId", "roomType")
        .exec();

        console.log("upcomingBookings", upcomingBookings);
        return upcomingBookings;
    } catch (error) {
        console.error("Error fetching upcoming bookings:", error);
        throw new Error("Unable to fetch upcoming bookings.");
    }
}



async getCompletedOrders(hostId: string): Promise<any> {
    try {

        const currentDate = new Date();

        const hotels = await Hotel.find({ hostId }).select("_id");
        const hotelIds = hotels.map(hotel => hotel._id);

        // Find bookings for those hotels
        const completedBookings = await Booking.find({
            hotelId: { $in: hotelIds },
            checkOut: { $lt: currentDate },
        })
        .populate({
            path: "hotelId",
            select: "hotelName hotelPhoto roomPolicies"
        })
        .populate("roomId", "roomType")
        .exec();

   
        return {completedBookings};
    } catch (error) {
        console.error("Error fetching upcoming bookings:", error);
        throw new Error("Unable to fetch upcoming bookings.");
    }
}




     async notificationCountUpdater(id: string): Promise<{ count: number }> {
      try {
  
  
        
        
        const message = await messageModel.aggregate([
          { $match:{$and:[ { sender: "user" },{ seen: false }]} },
          {$lookup:{
            from:"chats",
            localField:"chatId",
            foreignField:"_id",
            as:"chat"
          }  
        },
        {$match:{"chat.hostId":new mongoose.Types.ObjectId(id)}}
         
        ]);
       console.log(message.length);
       
        return { count: message.length };
      } catch (error: any) {
        throw new customError(error.message, error.statusCode);
      }
    }
  
    async notificationsGetter(id: string): Promise<{
      notfiyData: NotifyGetterResponse[] | [];
      countOfUnreadMessages: UnreadMessageCount[] | [];
    }> {
      try {
        const querynotifyData = [
          { $match: { hostId: new mongoose.Types.ObjectId(id) } },
          {
            $lookup: {
              from: "messages",
              localField: "latestMessage",
              foreignField: "_id",
              as: "message",
            },
          },
          { $unwind: "$message" },
          { $match: { "message.sender": "user" } },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $project: {
              hostId: 1,
              userId: 1,
              createdAt: 1,
              updatedAt: 1,
              latestMessage: 1,
              message: 1,
              "user.name": 1,
              "user.profileImage": 1,
            },
          },
        ];
  
        const querycountOfUnreadMessages = [
          {
            $lookup: {
              from: "chats",
              localField: "chatId",
              foreignField: "_id",
              as: "chat",
            },
          },
          { $unwind: "$chat" },
          {
            $match: {
              $and: [
                { "chat.hostId": new mongoose.Types.ObjectId(id) },
                { sender: "user" },
                { seen: false },
              ],
            },
          },
          { $group: { _id: "$chatId", count: { $sum: 1 } } },
        ];
  
        const notifyData: NotifyGetterResponse[] | [] =
          await chatModel.aggregate(querynotifyData);
        const countOfUnreadMessages: UnreadMessageCount[] | [] =
          await messageModel.aggregate(querycountOfUnreadMessages);
  
        return {
          notfiyData: notifyData,
          countOfUnreadMessages: countOfUnreadMessages,
        };
      } catch (error: any) {
        throw new customError(error.message, error.statusCode);
      }
    }
  
     
      
}