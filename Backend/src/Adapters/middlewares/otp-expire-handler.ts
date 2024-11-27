import { NextFunction,Response,Request} from "express";
import { CustomRequest } from "../interfaces/userInterface/iUserInteractor";


export class otpValidator{
        static async validateUserOtp(req:CustomRequest,res:Response,next:NextFunction){
            try {
                
                const now = Date.now()
                console.log(typeof now,"datetype");
                
            console.log(req.session,"sessionsss otp");
                if(!req.session.userOtpTime ||(now - req.session.userOtpTime) > 60000){
                    req.session.userOtpTime = null;
                    req.session.userEmailOtp = null;
                    throw new Error('OTP expired retry')
                }
                next()
            } catch (error) {
                console.log((error as string));
                next(error);
            }
        }
    
}