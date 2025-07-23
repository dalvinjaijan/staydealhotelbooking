import { Request as ExpressRequest,Response } from 'express';


export interface adminInteractorInterface{
    verifyLogin(email: string, password: string,res:Response):Promise<adminLoginSuccessResponse>
    getHotelRequests():Promise<any>
    approvehotelRequests(hostId:string,hotelId:string):Promise<any>
    getApprovedHotel():Promise<any>
    blockhotel(hotelId:string):Promise<any>
    getRejectedHotel():Promise<any>
    getUsers(pageNumber:number):Promise<any>
    blockuser(userId:string):Promise<any>
    unBlockuser(userId:string):Promise<any>
    getEditedHotelRequests():Promise<any>
    rejectEditHotelRequests(hostId:string,hotelId:string):Promise<any>
    approveEditHotelsRequest(hostId:string,hotelId:string):Promise<any>
    getWalletDetails():Promise<any>
    fetchReportLogic(period:string):Promise<any>
    fetchComplaint():Promise<any>
    addCoupons(data:Coupons):Promise<string>
    fetchCoupons(pageNumber:number):Promise<Coupons[]|string>


}

export interface adminLoginSuccessResponse{
    message: string;
    adminDetails:any
    accessToken:string,
    refreshToken:string,
    status: number;
}
  export interface Coupons{
    city:string|null,
    code:string,
    description:string,
    validity:string|Date,
    offerPercentage:string|number,
    maxDiscount:string|number,
    minPurchase:string|number
  }