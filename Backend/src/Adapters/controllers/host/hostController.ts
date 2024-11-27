import { hostInteractorInterface } from "../../interfaces/hostInterface/iHostInteractor";
import { CustomRequest } from "../../interfaces/userInterface/iUserInteractor";

import { NextFunction, Response, Request } from "express";
import { customError } from "../../middlewares/errorHandling";
import cloudinaryV2 from "../../../Utils/cloudinary";



export class hostController {
    private interactor: hostInteractorInterface;
  
    constructor(interactor: hostInteractorInterface) {
      this.interactor = interactor;
    }
  
    async registerHost(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
      try {
  
  
        const { firstName,lastName,email,phone,password } = req.body
        console.log(email, "email");
  
  
          const otp = await this.interactor.sendOtp(email);
          if (otp) {
            req.session.hostEmailOtp = otp;
            console.log("sessionOtp of host",req.session.hostEmailOtp)
            req.session.hostOtpTime = Date.now();
            req.session.hostDetails = {email,firstName,lastName,phone,password}
            console.log(req.session.hostDetails, "otp time")
            
  
            res.status(200).json({message: "OTP sent successfully" });
          } else {
            throw new customError('failed to sent Otp', 500)
  
          }
  
        
      } catch (error) {
        next(error)
      }
    }

    async verifyOtp(req: CustomRequest, res: Response, next: NextFunction) {
      try {
        const otp  = req.body?.otp
        console.log("otp inside verify otp",otp)

        const hostDetails = req.session.hostDetails || ''
        const sessionOTP = req.session.hostEmailOtp
        console.log("sessionotp in verifyotp controller",req.session.hostEmailOtp,sessionOTP)
  
        if (otp) {
          console.log("otp",otp)
          this.interactor.verifyOTP(otp, hostDetails, sessionOTP, res).then(result=>res.status(200).json({  message: result.message }))
                                                                .catch(error=>next(error))
        } else {
          throw new Error('Oops enter valid OTP')
        }
  
  
      }
      catch (error) {
        next(error)
      }
  
    }

    async login(req:Request,res:Response,next:NextFunction){
      try {
        const {email,password}=req.body
        const {message,hostDetails,accessToken,refreshToken,status}= await this.interactor.verifyHost(email,password,res)
        res.status(status).json({message,hostDetails,accessToken,refreshToken,status})
      } catch (error) {
        next(error)
        
      }
    }

    async logout(req:CustomRequest,res:Response,next:NextFunction){
      try {
        console.log("logout",req.cookies)
      res.clearCookie('hostAccessToken');
      res.clearCookie('hostRefreshToken');
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

//   async addHotel(req:CustomRequest,res:Response,next:NextFunction){
//     try {
      
//       // console.log(formData?.hotelName);
      
//       console.log("form data",req.body)

//       // console.log("files",req.files)
//       const handleFileUpload = async (files: Express.Multer.File[]) => {
//         console.log("files", files);
//         let hotelPhotos: string[] = [];
//         let roomPhotos: string[] = [];
      
//         for (const file of files) {
//           const base64EncodedImage = Buffer.from(file.buffer).toString("base64");
//           const dataUri = `data:${file.mimetype};base64,${base64EncodedImage}`;
      
//           if (file.fieldname.includes('hotelPhoto')) {
//             const result = await cloudinaryV2.uploader.upload(dataUri, {
//               folder: "HotelPhotos",
//             });
//             const hotelImage = result?.secure_url;
//             hotelPhotos.push(hotelImage);
//           } 
          
//           if (file.fieldname.includes('roomPhoto')) {
//             const result = await cloudinaryV2.uploader.upload(dataUri, {
//               folder: "RoomPhotos", // Changed folder name for clarity
//             });
//             const roomPhoto = result?.secure_url;
//             roomPhotos.push(roomPhoto);
//           }
//         }
      
//         return {
//           hotelPhotos,
//           roomPhotos
//         };
//       };
//       const files = req.files as Express.Multer.File[];
//       const {hotelPhotos,roomPhotos}=await handleFileUpload(files)
      

//       const {message,newlyAddedHotel}=await this.interactor.addHotelDetails(req.body,hotelPhotos,roomPhotos)
    
//   res.status(200).json({message,hotelPhotos,roomPhotos,newlyAddedHotel})
//     } catch (error) {
//       next(error)
//     }

// }

async addHotel(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    // console.log("form data", req.body);
    console.log("hi")

    const handleFileUpload = async (files: Express.Multer.File[]) => {
      console.log("files", files);

      let hotelPhotos: string[] = [];
      let roomPhotos: { [key: string]: string[] } = {}; // RoomType -> Array of Photo URLs

      for (const file of files) {
        const base64EncodedImage = Buffer.from(file.buffer).toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64EncodedImage}`;

        if (file.fieldname.includes("hotelPhoto")) {
          const result = await cloudinaryV2.uploader.upload(dataUri, {
            folder: "HotelPhotos",
          });
          console.log("result",result)
          hotelPhotos.push(result.secure_url);
        } else if (file.fieldname.includes("_photo")) {
          // Extract the roomType from the fieldname (e.g., "deluxe_photo0.jpg")
          const roomType = file.fieldname.split("_")[0];

          const result = await cloudinaryV2.uploader.upload(dataUri, {
            folder: "RoomPhotos",
          });

          // Initialize the roomType key if it doesn't exist
          if (!roomPhotos[roomType]) {
            roomPhotos[roomType] = [];
          }
          roomPhotos[roomType].push(result.secure_url);
        }
      }
      console.log("roomPhotos",roomPhotos)
      console.log("hotelPhotos",hotelPhotos)

      return { hotelPhotos, roomPhotos };
    };

    const files = req.files as Express.Multer.File[];
    const { hotelPhotos, roomPhotos } = await handleFileUpload(files);

    // Ensure room categories are parsed properly
    // const roomCategories = JSON.parse(req.body.roomCategories);

    const { message, newlyAddedHotel } = await this.interactor.addHotelDetails(
      req.body,
      hotelPhotos,
      roomPhotos,
      
    );

    res.status(200).json({ message, hotelPhotos, roomPhotos, newlyAddedHotel });
  } catch (error) {
    next(error);
  }
}


async fetchHotels(req:Request,res:Response,next:NextFunction){
  try {
    const {hostId}=req.query
    console.log("hostId",hostId)
 const response=await this.interactor.getHotels(hostId)
 res.status(200).json(response)

  } catch (error) {
    next(error)
  }
}

async editHotelDetails(req:Request,res:Response,next:NextFunction){
  try {
    const {editedData,hostId}=req.body
    console.log("hostId",hostId,editedData)
 const response=await this.interactor.editHotelRequest(editedData,hostId)
 if(response)
  res.status(200).json({response,message:"Requested for editing hotel"})

  } catch (error) {
    next(error)
  }
}


}
  