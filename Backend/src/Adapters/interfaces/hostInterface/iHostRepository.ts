import { ObjectId, Types } from "mongoose"
import { Document } from 'mongoose';

export interface hostRepositoryInterface{
   
     createHost(hostDetails:any):Promise<Types.ObjectId>
     findHostByEmail(email: string): Promise<any>
     addHotel(data:any,hostId:string,hotelPhotos:string[],roomPhotos: { [key: string]: string[] }):Promise<any>
    findHostById(hostid:string):Promise<HostDocument>
    fetchHotels(hostId:any):Promise<any>
    addingEditedhotelData(editedData:any,hostId:string):Promise<any>
    fetchProfileDetails(hostId:string):Promise<any>
    fetchWalletTransactions(hostId:string):Promise<any>
    fetchYearlyBookings(hostId:string):Promise<any>
    fetchMonthlyBookings(hostId:string):Promise<any>
    fetchDailyBookings(hostId:string):Promise<any>
    fetchPieReport(hostId:string):Promise<any>
    getUpcomingOrders(hostId:string):Promise<any>
    getCompletedOrders(hostId:string):Promise<any>

    notificationCountUpdater(id: string): Promise<{ count: number }>;
    notificationsGetter(id: string): Promise<{
      notfiyData: NotifyGetterResponse[] | [];
      countOfUnreadMessages: UnreadMessageCount[] | [];
    }>;

}



// export interface Address {
//     buildingNo: string | null;
//     locality: string | null;
//     district: string | null;
//     state: string | null;
//     pincode: string | null;
// }

export interface NotifyGetterResponse {
    _id: ObjectId;
    hostId: ObjectId;
    userId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    latestMessage: ObjectId;
    message: {
      _id: ObjectId;
      sender: "user";
      chatId: ObjectId;
      message: string;
      hostdelete: boolean;
      userdelete: boolean;
      seen: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  }

export interface RoomCategory extends Types.Subdocument {
    roomType: string | null;
    roomSize: string | null;
    noOfRooms: number | null;
    roomPrice: number | null;
    roomAmenities: string[];
    roomPhotos: string[];
}

export interface RoomPolicy {
    checkIn: string | null;
    checkOut: string | null;
}

export interface Hotel extends Types.Subdocument {
    hotelName: string | null;
    address: object | null;
    totalNoOfRooms: number | null;
    amenities: string[];
    hotelPhoto: string[];
    roomCategories: Types.DocumentArray<RoomCategory>;
    roomPolicies: RoomPolicy | null;
    hotelRules: string[];
    cancellationPolicy: string | null;
    
}

export interface HostInterface {
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: number | null;
    profileImage: string | null;
    password: string;
    hotels: Types.ObjectId[];
}
export interface EditedData {
    hotelName: string;
    totalNoOfRooms: number;
    amenities: string[];
    hotelPhoto: string[];
    hotelRules: string[];
    cancellationPolicy: string;
    isHotelListed: string;
    roomPolicies?: { checkIn: string; checkOut: string } | null;
    address?: any;
    location?: { type: string; coordinates: number[] } | null;
    editedData?: EditedData | null; // Add this line
  }

export interface HostDocument extends HostInterface, Document {}

export interface UnreadMessageCount {
    _id: ObjectId;
    count: number;
  }