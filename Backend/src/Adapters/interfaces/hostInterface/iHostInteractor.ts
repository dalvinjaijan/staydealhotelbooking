import { Request as ExpressRequest,Response } from 'express';
import { Types } from "mongoose"


export interface LoginSuccessResponse {
    message: string;
    hostDetails:any
    accessToken:string,
    refreshToken:string,
    status: number;
  }

export interface hostInteractorInterface{
    sendOtp(email:string):Promise<string>
    verifyOTP(otp:string,hostDetails:any,sessionOTP:any,res:Response):Promise<any>
    verifyHost(email: string, password: string,res:Response): Promise<LoginSuccessResponse>
    addHotelDetails(data:any,hotelPhotos:string[],roomPhotos: { [key: string]: string[] }):Promise<any>
    getHotels(hostId:any):Promise<any>
    editHotelRequest(editedData:{},hostId:string):Promise<any>
}