import { Types } from "mongoose"
import { bookingHotelDetails } from "./iUserInteractor"

export interface userRepositoryInterface{
    fetchNearByHotels(lat: number, lng: number): Promise<any>
    findUserByEmail(email:string):Promise<any>
    createUser(email:string):Promise<Types.ObjectId>
    findUserById(userId:string):Promise<any>
    saveUserDetails(user:any,userDetails:any,profileImage:string):Promise<any>
    getUserDetails(email:string):Promise<any>
    searchHotels(data:searchHotelsData):Promise<any>
    fetchFilteredHotels(data:filterHotelsData):Promise<any>
    getHotelDetails(data:dataForBookingHotel):Promise<any>
    fetchHotelDetails(data:dataForBookingHotel):Promise<any>
    reserveRoom(bookingDetails:bookingHotelDetails):Promise<any>
    getUpcomingOrders(userId:string):Promise<any>
    getCompletedOrders(userId:string):Promise<any>

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
    checkIn:Date,
    checkOut:Date,
    searchTerm:string,
    hotelId:string,
    roomId:string,
    guestNumber:number
}