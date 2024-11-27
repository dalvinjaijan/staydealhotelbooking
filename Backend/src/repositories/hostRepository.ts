import { Types } from 'mongoose'
import bcrypt from 'bcryptjs'
import { HostDocument, HostInterface, hostRepositoryInterface } from '../Adapters/interfaces/hostInterface/iHostRepository'
import Host from '../db/models/hostSchema'

export class hostRepository implements hostRepositoryInterface{
    private hostDb:typeof Host

    constructor(){
        this.hostDb=Host
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

    async addHotel(data: any, hotelPhotos: string[], roomPhotos: { [key: string]: string[] },hostDetails: HostDocument): Promise<any> {
        try {
           
            console.log("room photos",roomPhotos)
            
            const {hotelName,address,latitude,longitude,totalNoOfRooms,amenities,roomCategories,roomPolicies,hotelRules,cancellationPolicy}=data
            console.log("roomCatogery",typeof roomCategories,roomCategories)
            let parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
            let parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
            let parsedhotelRules = typeof hotelRules === 'string' ? JSON.parse(hotelRules) : hotelRules;
            // let parsedRoomAmenities = typeof roomCategories?.amenities === 'string' ? JSON.parse(roomCategories?.amenities) : roomCategories?.amenities;



            
            let parsedRoomPolicies = typeof roomPolicies === 'string' ? JSON.parse(roomPolicies) : roomPolicies;
           
           
            console.log("Photos",roomPhotos)
            const newHotel = {
                hotelName,
                address:parsedAddress,
                totalNoOfRooms,
                amenities:parsedAmenities,
                hotelPhoto: hotelPhotos, // Array of hotel photo filenames
                roomCategories: roomCategories.map((category: string) => {
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
                roomPolicies:parsedRoomPolicies,
                hotelRules:parsedhotelRules,
                cancellationPolicy,
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude], // Longitude first, then latitude
                  },
            };
            console.log("newHotel",newHotel)
    
            if (!hostDetails) {
                throw new Error("Host details not found");
            }
    
           
            const savedData=await this.hostDb.findByIdAndUpdate({_id:hostDetails?._id},
                {$push:{hotels:newHotel}},{ new: true } 
            )
            
            
           
            const lastAddedHotel = savedData?.hotels?.[savedData.hotels.length - 1]
            console.log("Hotel successfully added hote id",lastAddedHotel?._id);
            const newlyAddedHotel={
                hotelId:lastAddedHotel?._id,
                hotelName,
                address,
                latitude,
                longitude,
                totalNoOfRooms,
                amenities:parsedAmenities,
                hotelPhotos,
                roomCategories: roomCategories.map((category: string) => {
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
                { 
                    $unwind: "$hotels" // Unwind the hotels array to filter individual hotels
                },
                { 
                    $match: { "hotels.isHotelListed": "approved" } // Match only hotels that are approved
                },
                { 
                    $group: { // Group the results back by host _id and array the approved hotels
                        _id: "$_id",
                        hotels: { $push: "$hotels" }
                    }
                }
            ]);
    
            // console.log("response aggregate", response);
            return response;
        } catch (error) {
            console.error("Error fetching hotels:", error);
            throw error;
        }
    }


    async addingEditedhotelData(editedData: any, hostId: string): Promise<any> {
        try {
            const hotelId=editedData?._id
            const response = await this.hostDb.findOneAndUpdate(
              {_id:hostId,"hotels._id":hotelId},{$set:{"hotels.$.editedData":editedData}},{new:true}
            );
    
            console.log("response aggregate", response);
            return response;
        } catch (error) {
            console.error("Error fetching hotels:", error);
            throw error;
        }
    }
      
}