import { Request as ExpressRequest,Response } from 'express';
import { ObjectId } from "mongoose"


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
    viewProfile(hostId:string):Promise<any>
    viewTransactions(hostId:string):Promise<any>
    fetchReportLogic(period:string,hostId:string):Promise<any>
    fetchPieData(period:string):Promise<any>
    notificationCountUpdater(id: string): Promise<{ count: number }>;
    notificationsGetter(
      id: string
    ): Promise<{ notfiyData: INotifyGetterResponse[] | [] }>;

    reservations(type:string,userId:string):Promise<any>



}
export interface INotifyGetterResponse {
  _id: ObjectId;
  hostId: ObjectId;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  latestMessage: ObjectId;
  count: number;
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