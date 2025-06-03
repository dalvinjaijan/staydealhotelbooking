import { adminInteractorInterface, adminLoginSuccessResponse } from "../Adapters/interfaces/adminInterface/iAdminInteractor"
import { adminRepositoryInterface } from "../Adapters/interfaces/adminInterface/iAdminRepository"
import { customError } from "../Adapters/middlewares/errorHandling"
import bcrypt from 'bcryptjs'
import { generateAcessToken, generateRefreshToken } from "../Utils/jwt"
import {  Response } from "express";



export class adminInteractor implements adminInteractorInterface{
    private repository:adminRepositoryInterface
    constructor(repository:adminRepositoryInterface){
        this.repository=repository
    }
    async verifyLogin(email: string, password: string,res:Response): Promise<adminLoginSuccessResponse> {
       try {
         const isEmailExist=await this.repository.findByEmail(email) 
         if(!isEmailExist){
            const error= new customError('Incorrect email', 401);
            throw error
            
         }
         const adminId=isEmailExist._id
         const isPasswordValid = await bcrypt.compare(password, isEmailExist.password);
          console.log("valid pasword",isPasswordValid) 
          

      
          if (!isPasswordValid) {
            const error= new customError('Incorrect password', 401);
            throw error
          }

             const identity='admin'
             const accessToken=generateAcessToken(res,adminId.toString(),identity)
             const refreshToken=generateRefreshToken(res,adminId.toString(),identity)
             console.log("Accesstoken",accessToken)
      
          return {
            message: 'Login successfully',
            adminDetails:isEmailExist,
            accessToken:accessToken,
            refreshToken:refreshToken,
            status: 200,
          };
       } catch (error) {
            throw error
       }
    }
     async getHotelRequests(): Promise<any> {
       try {
         const response=await this.repository.findHotelRequest()
         return response
       } catch (error) {
         
       }
    }
    async approvehotelRequests(hostId:string,hotelId:string): Promise<any> {
      try {
        const response=await this.repository.approveHotel(hostId,hotelId)
        return response
      } catch (error) {
        
      }
    }

    async getApprovedHotel(): Promise<any> {
      try {
        const response=await this.repository.findApprovedHotel()
        return response
      } catch (error) {
        
      }
   }
   async blockhotel(hotelId:string): Promise<any> {
    try {
      const response=await this.repository.blockHotel(hotelId)
      return response
    } catch (error) {
      
    }
  }

  async getRejectedHotel(): Promise<any> {
    try {
      const response=await this.repository.findRejectedHotel()
      return response
    } catch (error) {
      
    }
 }

 async getUsers(): Promise<any> {
  try {
    const response=await this.repository.fetchUsers()
    return response
  } catch (error) {
    
  }
}

async blockuser(userId:string): Promise<any> {
  try {
    const response=await this.repository.blockUser(userId)
    return response
  } catch (error) {
    
  }
}
async unBlockuser(userId:string): Promise<any> {
  try {
    const response=await this.repository.unBlockUser(userId)
    return response
  } catch (error) {
    
  }
}
   
async getEditedHotelRequests(): Promise<any> {
  try {
    const response=await this.repository.findEditedHotelRequest()
    return response
  } catch (error) {
    
  }
}

async rejectEditHotelRequests(hostId: string, hotelId: string): Promise<any> {
  try {
    const response=await this.repository.rejectEditHotelRequests(hostId, hotelId)
    if(response)
    return response
  
  return "no hotels found"
  } catch (error) {
    
  }
}

async approveEditHotelsRequest(hostId: string, hotelId: string): Promise<string> {
  try {
    const response=await this.repository.approveEditHotelRequests(hostId, hotelId)
    if(response)
    return response
  
  return "no hotels found"
  } catch (error) {
    throw new Error("Error fetching hotel requests");
    
  }
}

async getWalletDetails(): Promise<any> {
  try {
    const response=await this.repository.fetchWalletDetails()
    if(response)
    return response
  } catch (error) {
    throw new Error("Error fetching wallet Details");
    
  }
}

async fetchReportLogic(period: string): Promise<any> {
  try {
    if(period==="yearly"){
      const yearlyData=await this.repository.fetchYearlyBookings()
      return yearlyData
    }else if(period==="monthly"){
      const monthlyData=await this.repository.fetchMonthlyBookings()
      return monthlyData
    }else if(period==="daily"){
        const dailyData=await this.repository.fetchDailyBookings()
        return dailyData
    }
  } catch (error) {
    throw new Error("Error fetching report");

  }
}

async fetchComplaint(): Promise<any> {
  try {
    
        const response=await this.repository.fetchComplaints()
        return response
    
  } catch (error) {
    throw new Error("Error fetching report");

  }
}


}