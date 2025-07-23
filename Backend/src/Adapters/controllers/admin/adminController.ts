import { adminInteractorInterface } from "../../interfaces/adminInterface/iAdminInteractor";
import { CustomRequest } from "../../interfaces/userInterface/iUserInteractor";
import { NextFunction, Response, Request } from "express";
import bcrypt from 'bcryptjs'



export class adminController{
    private interactor:adminInteractorInterface
    constructor(interactor:adminInteractorInterface){
        this.interactor=interactor
    }
    async login(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {

        try {
            const {email,password}=req.body
            console.log("login email",email,password)
            // const salt = await bcrypt.genSalt(10);
            // const hashedPassword = await bcrypt.hash(password, salt); 
            // console.log("Hashed password",hashedPassword)
            const {message,adminDetails,accessToken,refreshToken,status}=await this.interactor.verifyLogin(email,password,res) 
            res.status(status).json({message,adminDetails,accessToken,refreshToken,status})

            console.log("this is response",message) 
              
        } catch (error) {
            next(error)
        }
        
    }

    async logout(req:CustomRequest,res:Response,next:NextFunction){
        try {
          console.log("logout",req.cookies)
        res.clearCookie('adminAccessToken');
        res.clearCookie('adminRefreshToken');
        res.clearCookie('session')
        req.session.destroy((err) => {
          if (err) {
           throw new Error 
          }
      })
      res.status(200).json({message:"Logout successfully"})
        } catch (error) {
          next(error)
        }
    
    }

    
    async fetchHotelRequests(req:Request,res:Response,next:NextFunction){
        try {
          console.log("fetch hotels")
       const response=await this.interactor.getHotelRequests()
       

      res.status(200).json({message:"hotel fetched successfully",response})
        } catch (error) {
          next(error)
        }
    
    }
    async approveHotelRequest(req:Request,res:Response,next:NextFunction){
      try {
        const {hostId,hotelId}=req.body
        console.log("hostId",typeof hostId,typeof hotelId)
     const response=await this.interactor.approvehotelRequests(hostId,hotelId)
     console.log("response approving",response)

    res.status(200).json({message:"hotel approved",response})
      } catch (error) {
        next(error)
      }
  
  }

  async fetchApprovedHotel(req:Request,res:Response,next:NextFunction){
    try {
   const response=await this.interactor.getApprovedHotel()
   

  res.status(200).json({message:"hotel fetched successfully",response})
    } catch (error) {
      next(error)
    }

}
async blockHotel(req:Request,res:Response,next:NextFunction){
  try {
    const {hotelId}=req.body
 const response=await this.interactor.blockhotel(hotelId)
 console.log("response approving",response)

res.status(200).json({message:"hotel blocked",response})
  } catch (error) {
    next(error)
  }

}
async fetchRejectedHotel(req:Request,res:Response,next:NextFunction){
  try {
 const response=await this.interactor.getRejectedHotel()
 

res.status(200).json({message:"hotel fetched successfully",response})
  } catch (error) {
    next(error)
  }

}
async fetchUsers(req:Request,res:Response,next:NextFunction){
  try {
    const {page}=req.query
    const pageNumber=page? parseInt(page as string, 10):1
    console.log("fetch users")
 const response=await this.interactor.getUsers(pageNumber)
 

res.status(200).json({message:"users fetched successfully",response})
  } catch (error) {
    next(error)
  }

}
    

async blockUser(req:Request,res:Response,next:NextFunction){
  try {
    const {userId}=req.body.userId
    console.log("userId",typeof userId,userId)
 const response=await this.interactor.blockuser(userId)
 console.log("response block",response)

res.status(200).json({message:"user blocked",response})
  } catch (error) {
    next(error)
  }

}
async unBlockUser(req:Request,res:Response,next:NextFunction){
  try {
    const {userId}=req.body.userId
    console.log("userId",typeof userId,userId)
 const response=await this.interactor.unBlockuser(userId)
 console.log("response block",response)

res.status(200).json({message:"user unBlocked",response})
  } catch (error) {
    next(error)
  }

}
async getEditedHotelsRequest(req:Request,res:Response,next:NextFunction){
  try {
    console.log("fetch hotels")
 const response=await this.interactor.getEditedHotelRequests()
 

res.status(200).json({message:"edit request of hotels fetched successfully",response})
  } catch (error) {
    next(error)
  }

}

async rejectEditHotelsRequest(req:Request,res:Response,next:NextFunction){
  try {
    const {hotelId,hostId}=req.body
    console.log("reject edit hotels",hotelId,hostId)
 const response=await this.interactor.rejectEditHotelRequests(hostId,hotelId)
 

res.status(200).json(response)
  } catch (error) {
    next(error)
  }

}

async approveEditHotelsRequest(req:Request,res:Response,next:NextFunction){
  try {
    const {hotelId,hostId}=req.body
    console.log("approve edit hotels",hotelId,hostId)
 const response=await this.interactor.approveEditHotelsRequest(hostId,hotelId)
 

res.status(200).json(response)
  } catch (error) {
    next(error)
  }

}

async walletDetails(req:Request,res:Response,next:NextFunction){
  try {
       const response=await this.interactor.getWalletDetails()
       console.log("response",response)
       res.json(response)
    
    
  
  } catch (error) {
    next(error)
    
  }
  }

  async fetchReport(req:Request,res:Response,next:NextFunction){
    try {
      const {period}=req.query
      if(typeof period==='string'){
        const response=await this.interactor.fetchReportLogic(period)
        console.log("period",period)
        res.json(response)
      }
      
    } catch (error) {
      next(error)
    }
  }

  async fetchComplaints(req:Request,res:Response,next:NextFunction){
    try{ 

        const response=await this.interactor.fetchComplaint()
        res.json(response)
    
      
    } catch (error) {
      next(error)
    }
  }
  async addCoupon(req:Request,res:Response,next:NextFunction){
    try{ 
      const data=req.body
      console.log(data)
        const response=await this.interactor.addCoupons(data)
        res.json(response)
    
      
    } catch (error) {
      next(error)
    }
  }

    async fetchCoupon(req:Request,res:Response,next:NextFunction){
    try{ 
      const {page}=req.query
      const pageNumber = page ? parseInt(page as string, 10) : 1;
        const response=await this.interactor.fetchCoupons(pageNumber)
        res.json(response)
    
      
    } catch (error) {
      next(error)
    }
  }




}