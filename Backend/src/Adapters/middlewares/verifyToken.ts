import { Request, Response, NextFunction } from 'express';
import jwt ,{JwtPayload} from 'jsonwebtoken';
import { generateAcessToken } from '../../Utils/jwt';
import dotenv from 'dotenv'
import User from '../../db/models/userSchema';
import { customError } from './errorHandling';
import { CustomRequest } from '../interfaces/userInterface/iUserInteractor';
dotenv.config()

interface token  {
  userId:String,
  iat:Number,
  exp:Number
}



export const verifyAccessToken= (type:string)=>{
  return async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const accessToken = req.cookies[`${type}AccessToken`];
    console.log("req.cookies-->",req.cookies);
    
    console.log("hyyy")
    console.log("ACCESS-->"+accessToken)
  
    try {
      console.log("valid")
  
     const token =  jwt.verify(accessToken, process.env.JWT_Access_SecretKey as string) as JwtPayload
      console.log('token decoded================>',token);
      
    const user =  await User.findById({_id:token?.userId})
    // console.log("user",user) 
    if(user && user?.isBlocked){
      const error = new customError('User has been blocked',401)
      throw error
    }
      
    req.user = { userId: token.userId, role: token.role }; 
  
      next(); // Access token is valid, proceed to the next middleware/route handler
    } catch (err) {
      console.log("inside catch");
      
      if (err instanceof jwt.JsonWebTokenError) {
      console.log("err intsance");
  
        const refreshToken = req.cookies[`${type}RefreshToken`];
        console.log(refreshToken,"refreshhh");
        
        if (!refreshToken) {
          console.log("no refresh token");
          
          return res.status(403).json({ message: 'Session expired login again' });
        }
  
        // Call the function to generate a new access token using the refresh token
        const newAccessToken = regenerateAccessToken(refreshToken, res);
        if (!newAccessToken) {
          return res.status(403).json({ message: 'Invalid Refresh Token' });
        }
  
        // Attach the new access token to the request headers or cookies
        req.cookies[`${type}AccessToken`] = newAccessToken;
        next(); // Proceed to the next middleware/route handler
       } 
      //else if (err instanceof jwt.JsonWebTokenError) {
      //   console.log(" err JsonWebTokenError");
        
      //   return res.status(403).json({ message: 'Invalid Access Token' });
      // }
       else {
        console.log(" Internal Server Error");
        next(err)
      }
    }
}
}
 

function regenerateAccessToken(refreshToken: string, res: Response): string | null {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_Refresh_SecretKey as string) as jwt.JwtPayload;
    console.log("decoded",decoded)
    const { userId, role } = decoded;
    return generateAcessToken(res, userId, role);
  } catch (err) {
    return null; // Invalid refresh token
  }
}

export function verifyRole(allowedRoles: string[]) {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    // console.log("role",req.user.role)
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
    }
    next();
  };
}
