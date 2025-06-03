import { Types,ObjectId } from "mongoose"
import { bookingHotelDetails } from "./iUserInteractor"

export interface userRepositoryInterface{
    fetchNearByHotels(lat: number, lng: number): Promise<any>
    findUserByEmail(email:string):Promise<any>
    createUser(email:string):Promise<Types.ObjectId>
    findUserById(userId:string):Promise<any>
    saveUserDetails(user:any,userDetails:any,profileImage:string):Promise<any>
    getUserDetails(email:string):Promise<any>
    searchHotels(updatedData:searchHotelsData):Promise<any>
    fetchFilteredHotels(data:filterHotelsData):Promise<any>
    getHotelDetails(data:dataForBookingHotel):Promise<any>
    fetchHotelDetails(data:dataForBookingHotel):Promise<any>
    reserveRoom(bookingDetails:bookingHotelDetails):Promise<any>
    getUpcomingOrders(userId:string):Promise<any>
    getCompletedOrders(userId:string):Promise<any>
    fetchWalletTransactions(userId:string):Promise<any>
    fullRefund(bookingId:string):Promise<string>
    partialRefund(bookingId:string):Promise<string>
    noRefund(bookingId:string):Promise<string>
    rateTheHotel(data:{rating:number,review:string,bookingId:string,userId:string,hotelId:string}):Promise<any>
    reportHotel(data:{complaint:string,bookingId:string,userId:string,hotelId:string}):Promise<any>
    notificationCountUpdater(id: string): Promise<{ count: number }>;
    notificationsGetter(id: string): Promise<{
        notfiyData: NotifyGetterResponse[] | [];
        countOfUnreadMessages: UnreadMessageCount[] | [];
    }>;


}

 export interface searchHotelsData{
    lngLat:{
        lat:number,
        lng:number
    },
    searchInput:string
}

export interface filterHotelsData{
    roomTypes:string[]|[],
    otherFilters:string[]|[], 
    lngLat:{
        lat:number,
        lng:number
    }
}

export interface dataForBookingHotel{
    lngLat:{
        lat:number,
        lng:number
    },
    numberOfRooms:number,
    totalGuests:number,
    checkIn:string,
    checkOut:Date|string,
    searchTerm:string,
    hotelId:string,
    roomId:string,
    guestNumber:number
}

export interface NotifyGetterResponse{
  
    _id: ObjectId,
    hostId: ObjectId,
    userId: ObjectId,
    createdAt:Date,
    updatedAt:Date,
    latestMessage: ObjectId,
    message: {
      _id: ObjectId,
      sender: 'host',
      chatId: ObjectId,
      message: string,
      hostdelete: boolean,
      userdelete: boolean,
      seen: boolean,
      createdAt: Date,
      updatedAt: Date,
      
    }
  
}

export interface UnreadMessageCount {
  _id:ObjectId
  count:number
}


export interface INotifyGetterResponse{
  
  _id: ObjectId,
  hostId: ObjectId,
  userId: ObjectId,
  createdAt:Date,
  updatedAt:Date,
  latestMessage: ObjectId,
  count:number,
  message: {
    _id: ObjectId,
    sender: 'host',
    chatId: ObjectId,
    message: string,
    hostdelete: boolean,
    userdelete: boolean,
    seen: boolean,
    createdAt: Date,
    updatedAt: Date,
    
  }

}
