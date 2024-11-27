import { Request as ExpressRequest,Response } from 'express';


export interface adminInteractorInterface{
    verifyLogin(email: string, password: string,res:Response):Promise<adminLoginSuccessResponse>
    getHotelRequests():Promise<any>
    approvehotelRequests(hostId:string,hotelId:string):Promise<any>
    getApprovedHotel():Promise<any>
    blockhotel(hostId:string,hotelId:string):Promise<any>
    getRejectedHotel():Promise<any>
    getUsers():Promise<any>
    blockuser(userId:string):Promise<any>
    unBlockuser(userId:string):Promise<any>
    getEditedHotelRequests():Promise<any>
    rejectEditHotelRequests(hostId:string,hotelId:string):Promise<any>
    approveEditHotelsRequest(hostId:string,hotelId:string):Promise<any>

}

export interface adminLoginSuccessResponse{
    message: string;
    adminDetails:any
    accessToken:string,
    refreshToken:string,
    status: number;
}