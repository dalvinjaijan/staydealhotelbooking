import { adminRepositoryInterface } from "../Adapters/interfaces/adminInterface/iAdminRepository"
import Admin from "../db/models/adminSchema"
import Host from "../db/models/hostSchema"
import User from "../db/models/userSchema"


export class adminRepository implements adminRepositoryInterface{
    private adminDb:typeof Admin
    private hostDb:typeof Host
    private userDb:typeof User
    

    constructor(){
        this.adminDb=Admin
        this.hostDb=Host
        this.userDb=User
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
            const response=await this.hostDb.aggregate([
                { $unwind: "$hotels" },
                { $match: { "hotels.isHotelListed": "pending" } }, 
                {
                  $project: {
                    _id: 0,
                    hostId:"$_id",
                    hotelName: "$hotels.hotelName",
                    ownerFirstName: "$firstName",
                    ownerLastName: "$lastName",
                    ownerEmail: "$email",
                    hotelPhoto: "$hotels.hotelPhoto",
                    hotelAddress: "$hotels.address", 
                    hotelId: "$hotels._id",
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
        const response = await Host.updateOne(
          { _id: hostId, 'hotels._id': hotelId },  
          { $set: { 'hotels.$.isHotelListed': 'approved' } }  
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

    async findApprovedHotel(): Promise<any> {
      try {
          const response=await this.hostDb.aggregate([
              { $unwind: "$hotels" },
              { $match: { "hotels.isHotelListed": "approved" } }, 
              {
                $project: {
                  _id: 0,
                  hostId:"$_id",
                  hotelName: "$hotels.hotelName",
                  ownerFirstName: "$firstName",
                  ownerLastName: "$lastName",
                  ownerEmail: "$email",
                  hotelPhoto: "$hotels.hotelPhoto",
                  hotelAddress: "$hotels.address", 
                  hotelId: "$hotels._id",
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
      const response = await Host.updateOne(
        { _id: hostId, 'hotels._id': hotelId },  
        { $set: { 'hotels.$.isHotelListed': 'blocked' } }  
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
            { $unwind: "$hotels" },
            { $match: { "hotels.isHotelListed": "blocked" } }, 
            {
              $project: {
                _id: 0,
                hostId:"$_id",
                hotelName: "$hotels.hotelName",
                ownerFirstName: "$firstName",
                ownerLastName: "$lastName",
                ownerEmail: "$email",
                hotelPhoto: "$hotels.hotelPhoto",
                hotelAddress: "$hotels.address", 
                hotelId: "$hotels._id",
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
          { $unwind: "$hotels" },
          { $match: { "hotels.isHotelListed": "approved","hotels.editedData":{$ne:null} } }, 
          {
            $project: {
              _id: 0,
              hostId:"$_id",
              hotelName: "$hotels.hotelName",
              ownerFirstName: "$firstName",
              ownerLastName: "$lastName",
              ownerEmail: "$email",
              hotelPhoto: "$hotels.hotelPhoto",
              hotelAddress: "$hotels.address", 
              hotelId: "$hotels._id",
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
      const response=await Host.updateOne(
        {_id:hostId,"hotels._id":hotelId},
        {$set: { 'hotels.$.editedData': null }}
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
    console.log("inside admin repo approveEditHotelRequests",hostId,hotelId)

    const host=await Host.findOne({_id:hostId,"hotels._id":hotelId},
      {'hotels.$':1}
    )

    if (!host || !host.hotels || host.hotels.length === 0) {
      return "No hotels found with the given hostId and hotelId";
    }
    const hotel=host.hotels[0]
    const editedData=hotel.editedData
    // console.log("edited",editedData)

    if (!editedData) {
      return "No edited data found for this hotel";
    }

    // const updateFields:any={}
    // for(const key in editedData){
    //   updateFields[`hotels.$.${key}`]=editedData[key]
    // }
    // updateFields['hotels.$.editedData']=null
    // console.log("Update fields:", JSON.stringify(updateFields, null, 2));
    // console.log('updatedFields',updateFields)
    console.log('EDO',editedData)
    const response = await Host.updateOne(
      { _id: hostId, "hotels._id": hotelId }, // Match host and the specific hotel
      { 
        $set: { 
          "hotels.$": { ...editedData } // Spread the new data into the matched array object
        } 
      }
    );
    
    if (response.acknowledged && response.modifiedCount> 0){
      return "Hotel edited data approved successfully";
    }
    return "No hotels found"
   } catch (error) {
    console.error(error)
    throw new Error("Error fetching hotel requests");
    
   }
 }
}