import { adminRepositoryInterface } from "../Adapters/interfaces/adminInterface/iAdminRepository"
import Admin from "../db/models/adminSchema"
import Host from "../db/models/hostSchema"
import User from "../db/models/userSchema"
import Hotel from "../db/models/hotelSchema"
import RoomCategory from "../db/models/roomSchema"



export class adminRepository implements adminRepositoryInterface{
    private adminDb:typeof Admin
    private hostDb:typeof Host
    private userDb:typeof User
    private hotelDb:typeof Hotel

    

    constructor(){
        this.adminDb=Admin
        this.hostDb=Host
        this.userDb=User
        this.hotelDb=Hotel
    }
    async findByEmail(email: string): Promise<any> {
        const isAdminExist=await this.adminDb.findOne({email})
        if(isAdminExist){
            return isAdminExist
        }
        return null
    }
    async findHotelRequest(): Promise<any> {
        try {
            const response= await Host.aggregate([
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
              console.log("response",response)
          
              return response;
            } catch (error) {
              console.error("Error fetching hotel requests:", error);
              throw new Error("Error fetching hotel requests");
            }
    }
    async approveHotel(hostId: string, hotelId: string): Promise<any> {
      try {
          // Verify the host owns the hotel before approving
          const host = await Host.findOne({ _id: hostId, hotels: hotelId }); // Ensure the host owns the hotel
          if (!host) {
              console.log('No matching host or hotel found.');
              return { success: false, message: 'No matching host or hotel found.' };
          }
  
          // Update the `isHotelListed` field in the `Hotel` collection
          const response = await Hotel.updateOne(
              { _id: hotelId },
              { $set: { isHotelListed: 'approved' } }
          );
  
          if (response.acknowledged && response.modifiedCount > 0) {
              console.log('Hotel successfully approved.');
              return { success: true, message: 'Hotel successfully approved.' };
          } else {
              console.log('Failed to update the hotel status.');
              return { success: false, message: 'Failed to update the hotel status.' };
          }
      } catch (error) {
          console.error('Error approving hotel:', error);
          throw error;
      }
  }
  
    async findApprovedHotel(): Promise<any> {
      try {
          const response=await this.hostDb.aggregate([
              { $lookup:{
                from: "hotels",
                localField:"hotels",
                foreignField:"_id",
                as:"hotelDetails"
              }},
              {$unwind:"$hotelDetails"},
              { $match: { "hotelDetails.isHotelListed": "approved" } }, 
              {
                $project: {
                  _id: 0,
                  hostId:"$_id",
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
            console.log("responsesdfsd",response)
         
            return response;
          } catch (error) {
            console.error("Error fetching hotel requests:", error);
            throw new Error("Error fetching hotel requests");
          }
  }

  async blockHotel(hostId: string, hotelId: string): Promise<any> {
    try {
      const response = await Hotel.updateOne(
        { _id: hotelId },  
        { $set: { isHotelListed: 'blocked' } }  
      );
  
      if (response.acknowledged && response.modifiedCount> 0) {
        console.log('Hotel successfully approved and isHotelListed set to true.');
      } else {
        console.log('No matching host or hotel found.');
      }
  
      return response;
    } catch (error) {
      console.error('Error approving hotel:', error);
      throw error;
    }
  }

  async findRejectedHotel(): Promise<any> {
    try {
        const response=await this.hostDb.aggregate([
          {$lookup: {
            from:"hotels",
            localField:"hotels",
            foreignField:"_id",
            as:"hotelDetails"
          }},
            { $unwind: "$hotelDetails" },
            { $match: { "hotelDetails.isHotelListed": "blocked" } }, 
            {
              $project: {
                _id: 0,
                hostId:"$_id",
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
          console.log("block",response)
       
          return response;
        } catch (error) {
          console.error("Error fetching hotel requests:", error);
          throw new Error("Error fetching hotel requests");
        }
}

async fetchUsers(): Promise<any> {
  try {
      const response=await this.userDb.find();
        console.log("users",response)
     
        return response;
      } catch (error) {
        console.error("Error fetching users", error);
        throw new Error("Error fetching users");
      }
}

async blockUser(userId: string): Promise<any> {
  try {
    const response = await User.updateOne(
      { _id: userId},  
      { $set: { isBlocked:true } }  
    );

  
    return response;
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
}

async unBlockUser(userId: string): Promise<any> {
  try {
    const response = await User.updateOne(
      { _id: userId},  
      { $set: { isBlocked:false } }  
    );

  
    return response;
  } catch (error) {
    console.error('Error unBlocking user:', error);
    throw error;
  }
}
async findEditedHotelRequest(): Promise<any> {
  try {
      const response=await this.hostDb.aggregate([
        {$lookup: {
          from:"hotels",
          localField:"hotels",
          foreignField:"_id",
          as:"hotelDetails"
        }},
          { $unwind: "$hotelDetails" },
          { $match: { "hotelDetails.isHotelListed": "approved","hotelDetails.editedData":{$ne:null} } }, 
          {
            $project: {
              _id: 0,
              hostId:"$_id",
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
        console.log("response of editedHotel",response)
    
        return response;
      } catch (error) {
        console.error("Error fetching hotel requests:", error);
        throw new Error("Error fetching hotel requests");
      }
}

async rejectEditHotelRequests(hostId: string, hotelId: string): Promise<string> {
  try {
      const response=await Hotel.updateOne(
        {_id:hotelId},
        {$set: { editedData: null }}
      )
      if (response.acknowledged && response.modifiedCount> 0){
        return "Hotel edited data rejected successfully";
      }
      return "No hotels found"
  } catch (error) {
    throw error
  }
}

 async approveEditHotelRequests(hostId: string, hotelId: string): Promise<string> {
   try {
    

    const hotel = await Hotel.findOne({ _id: hotelId });
    if (!hotel) {
      return "No hotel found with the given hotelId.";
    }

    // Verify that the hotel belongs to the host
    const host = await Host.findOne({ _id: hostId, hotels: hotelId });
    if (!host) {
      return "The specified hotel does not belong to the given host.";
    }

    const { editedData } = hotel;
    if (!editedData) {
      return "No edited data found for this hotel.";
    }

    // console.log("Edited Data:", editedData)
    const {roomCategories,...hotelDataToUpdate}=editedData

    if ('editedData' in hotelDataToUpdate) {
  delete (hotelDataToUpdate as any).editedData;
}    // Ensure editedData is explicitly cleared

    console.log("hotelDataToUpdate",hotelDataToUpdate)
    const roomCategoryIds=[]
    console.log("roomCategories",roomCategories)
    for(const roomCategory of roomCategories){
        if(roomCategory._id){
          const updatedRoomCategory=await RoomCategory.findByIdAndUpdate(
            roomCategory._id,
            roomCategory,
          {new :true}) 
          if (!updatedRoomCategory) {
            return `Room category with ID ${roomCategory._id} not found.`;
          }
          roomCategoryIds.push(updatedRoomCategory._id);
        }
    }

    // Update the hotel with the edited data and clear the `editedData` field
    const response = await Hotel.findByIdAndUpdate(
      hotelId,
      {
        $set: {
          ...hotelDataToUpdate,
          roomCategories: roomCategoryIds, // Set updated room category IDs
          editedData:null, // Clear editedData
        },
      },
      { new: true }
    );
    console.log("response in approving ",response)
    if (response){
      return "Hotel edited data approved successfully";
    }
    return "No hotels found"
   } catch (error) {
    console.error(error)
    throw new Error("Error fetching hotel requests");
    
   }
 }
}