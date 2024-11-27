import { hostInteractorInterface, LoginSuccessResponse } from "../Adapters/interfaces/hostInterface/iHostInteractor"
import { hostRepositoryInterface } from "../Adapters/interfaces/hostInterface/iHostRepository"
import { customError } from "../Adapters/middlewares/errorHandling";
import { generateAcessToken, generateRefreshToken } from "../Utils/jwt"
import { sendMail } from "../Utils/nodemailer"
import { NextFunction, Response } from "express";
import bcrypt from 'bcryptjs'
import { hostRepository } from "../repositories/hostRepository";


export class hostInteractor implements hostInteractorInterface{
    private repository:hostRepositoryInterface
    constructor(repository:hostRepositoryInterface){
        this.repository=repository
    }

    async sendOtp(email:string):Promise<string>{
        try {
        const otp=await sendMail(email)
        return otp
            
        } catch (error) {
            throw error  
        }
    }

    async verifyOTP(otp:string,hostDetails:any,sessionOTP:any,res:Response){
        try {
            console.log("session otp",sessionOTP)
            console.log(" otp",otp)

          if(otp===sessionOTP){
           
          
                const hostId=await this.repository.createHost(hostDetails)
           
             return {message:"Signup successfully"}

            }
            
          else{
            const error = new customError("Incorrect OTP", 401)
            
            // error.message = 'Incorrect OTP'
            // error.status = 401
            throw error
          }
        } catch (error) {
           throw error
            
        }
    }

    async verifyHost(email: string, password: string,res:Response): Promise<LoginSuccessResponse>{
    try {
        const hostExist=await this.repository.findHostByEmail(email)
        console.log("hostDetails",hostExist)
        if (!hostExist) {
            throw new customError('Incorrect email', 401);
          }
          console.log("password",password,"type",typeof password)
          console.log("hash password",hostExist.password,"type",typeof  hostExist.password)
          const hostId=hostExist._id
            
      
          const isPasswordValid = await bcrypt.compare(password, hostExist.password);
          console.log("valid pasword",isPasswordValid) 
          

      
          if (!isPasswordValid) {
            throw new customError('Incorrect password', 401);
          }
          const identity='host'
             const accessToken=generateAcessToken(res,hostId.toString(),identity)
             const refreshToken=generateRefreshToken(res,hostId.toString(),identity)
             console.log("Accesstoken",accessToken)
      
          return {
            message: 'Login successfully',
            hostDetails:hostExist,
            accessToken:accessToken,
            refreshToken:refreshToken,
            status: 200,
          };
    } catch (error) {
        throw error
    }
    }

    async addHotelDetails(data: any, hotelPhotos: string[], roomPhotos: { [key: string]: string[] }): Promise<any> {
      try {
        const {hostid}=data
        console.log("host id",data)
      const hostDetails=await this.repository.findHostById(hostid)
      
        const {message,newlyAddedHotel}=await this.repository.addHotel(data,hotelPhotos,roomPhotos,hostDetails)
        if(message!=="Request for adding hotel is sent"){
          throw new customError('error while adding hotel', 401)
        }

        return{message,newlyAddedHotel}
      } catch (error) {
        throw error
      }
      
    }
    async getHotels(hostId: any) {
      try {
        const response=await  this.repository.fetchHotels(hostId)
        return response

      } catch (error) {
        
      }
    }

    async editHotelRequest(editedData:{},hostId:string):Promise<any> {
      try {
        const response=await  this.repository.addingEditedhotelData(editedData,hostId)
        return response

      } catch (error) {
        
      }
    }
}
