

import { bookingHotelDetails, userInteractorInterface } from "../Adapters/interfaces/userInterface/iUserInteractor";
import { dataForBookingHotel, filterHotelsData, searchHotelsData, userRepositoryInterface } from "../Adapters/interfaces/userInterface/iUserRepositoryInterface";
import { generateAcessToken, generateRefreshToken } from "../Utils/jwt";
import { sendMail } from "../Utils/nodemailer";
import jwt from 'jsonwebtoken'
import {customError, errorHandler} from '../Adapters/middlewares/errorHandling'
import { NextFunction, Response } from "express";


export class userInteractor implements userInteractorInterface{
    private repository:userRepositoryInterface
    constructor(repository:userRepositoryInterface){
        this.repository=repository
    }


    async getUserByEmail(email:string):Promise<string>{
        try {
        const user=await this.repository.getUserDetails(email)
        return user
            
        } catch (error) {
            throw error  
        }
    }

        async sendOtp(email:string):Promise<string>{
            try {
            const otp=await sendMail(email)
            return otp
                
            } catch (error) {
                throw error  
            }
        }

        async verifyOTP(otp:string,email:string,sessionOTP:any,res:Response){
            try {
              if(otp===sessionOTP){
                const userId=await this.repository.findUserByEmail(email)
                if(userId){
                    const identity='user'
                 const accessToken=generateAcessToken(res,userId.toString(),identity)
                 const refreshToken=generateRefreshToken(res,userId.toString(),identity)
                 return {accessToken,refreshToken,userId}
                }else{
                    const userId=await this.repository.createUser(email)
                    const identity='user'
                 const accessToken=generateAcessToken(res,userId.toString(),identity)
                 const refreshToken=generateRefreshToken(res,userId.toString(),identity)
                 console.log("Accesstoken",accessToken)
                 return {accessToken,refreshToken,userId}

                }
                
              }else{
                const error = new customError("Incorrect OTP", 401)
                
                // error.message = 'Incorrect OTP'
                // error.status = 401
                throw error
              }
            } catch (error) {
               throw error
                
            }
        }

        async getUserDetails(userId: string): Promise<any> {
            const userDetails=this.repository.findUserById(userId)
            return userDetails
        }
        async saveProfile(data: any, profileImage: string): Promise<any> {
            const{userId}=data
            const user=await this.repository.findUserById(userId)
            if(user){
                // console.log("user in saveProfile",user)
                await this.repository.saveUserDetails(user,data,profileImage)
                return {message:"user update succcessfully"}
            }
        }

        async getNearbyHotels(lat: number, lng: number): Promise<any> {
            try {
                const response=await this.repository.fetchNearByHotels(lat,lng)
                return response
            } catch (error) {
                throw error
            }
        }
        async getHotels(data:searchHotelsData): Promise<any> {
            try {
                const response=await this.repository.searchHotels(data)
                return response
            } catch (error) {
                throw error
            }
        }
        async getFilteredHotels(data:filterHotelsData): Promise<any> {
            try {
                const response=await this.repository.fetchFilteredHotels(data)
                return response
            } catch (error) {
                throw error
            }
        }

        async fetchHotel(data:dataForBookingHotel): Promise<any> {
            try {
                const response=await this.repository.getHotelDetails(data)
                return response
            } catch (error) {
                throw error
            }
        }

        async fetchHotelDetails(data: dataForBookingHotel): Promise<any> {
            try {
                const response=await this.repository.fetchHotelDetails(data)
                return response
            } catch (error) {
                throw error
            }
        }

        async bookRoom(bookingDetails: bookingHotelDetails): Promise<any> {
            try {

                
                const response=await this.repository.reserveRoom(bookingDetails)
                return response
            } catch (error) {
                throw error
            }
        }

       async myOrders(type: string, userId: string): Promise<any> {
            try {
                if(type==="upcoming"){
                    const response=await this.repository.getUpcomingOrders(userId)
                    return response
                }else{
                    const response=await this.repository.getCompletedOrders(userId)
                    return response
                }
            } catch (error) {
                throw error
            }
        }
        
       
}