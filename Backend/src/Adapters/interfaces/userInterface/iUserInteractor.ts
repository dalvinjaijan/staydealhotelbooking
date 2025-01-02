import { Request as ExpressRequest,Response } from 'express';
import { Session } from 'express-session';
import { dataForBookingHotel } from './iUserRepositoryInterface';

export interface userInteractorInterface{
    sendOtp(email:string):Promise<string>
    verifyOTP(otp:string,email:string,sessionOTP:any,res:Response):Promise<any>
    getUserDetails(userId:string):Promise<any>
    saveProfile(data:any,profileImage:string|null):Promise<any>
    getNearbyHotels(lat:number,lng:number):Promise<any>
    getUserByEmail(email:string):Promise<string>
    getHotels(data:object):Promise<any>
    getFilteredHotels(data:object):Promise<any>
    fetchHotel(data:dataForBookingHotel):Promise<any>
    fetchHotelDetails(data:dataForBookingHotel):Promise<any>
    bookRoom(bookingDetails:bookingHotelDetails):Promise<any>
    myOrders(type:string,userId:string):Promise<any>
}



interface CustomSession extends Session {
  userEmailOtp?: string|null;
  userOtpTime?: number|null;
  userEmail?:string,
  hostEmailOtp?: string|null;
  hostOtpTime?: number|null;
  hostDetails?:{
    email:string
    firstName:string,
    lastName:string,
    phone:number,
    password:string
  }|null
}

export interface CustomRequest extends ExpressRequest {
  session: CustomSession;
  File?:Express.Multer.File
}
export interface bookingHotelDetails{
  lngLat:{
      lat:number,
      lng:number
  },
  numberOfRooms:number,
  totalGuests:number,
  checkIn:Date,
  checkOut:Date  ,
  searchTerm:string,
  guestNumber:number,
  hotelName:string,
  hotelAddress:string,
  roomPrice:number,
  totalAmount:number,
  roomType:string,
  name:string,
  email:string,
  phone:string,
  country:string,
  hotelId:string,
  roomId:string,
  paymentId:string,
  paymentMethod:string,
  userId:string
}
