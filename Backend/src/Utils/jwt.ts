import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { Response } from 'express';

dotenv.config();


export function generateAcessToken(res:Response,userId:string,identity:string){

  const payload={userId,role:identity}
  const token =jwt.sign(payload,process.env.JWT_Access_SecretKey as string,{
    expiresIn:"7d"
  })
  res.cookie(`${identity}AccessToken`,token,{
    httpOnly: true, 
     
    sameSite: 'strict' ,
 
    maxAge:60 * 60 * 1000 //1 hour
  })
  return token
}

export function generateRefreshToken(res:Response,userId:string,identity:string){
  const payload={userId,role:identity}
  const token =jwt.sign(payload,process.env.JWT_Refresh_SecretKey as string,{
    expiresIn:"30d"
  })
  res.cookie(`${identity}RefreshToken`,token,{
    httpOnly: true, 
    
    sameSite: 'strict' ,
    
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
  return token

}
