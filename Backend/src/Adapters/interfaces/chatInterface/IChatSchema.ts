import { Document, ObjectId, Types } from "mongoose";

export interface IMessage {
  sender: "user" | "host"; 
  chatId:ObjectId ,
  message: string; 
  hostdelete?: boolean;
  userdelete?: boolean; 
  createdAt?: Date; 
  updatedAt?: Date; 
  seen:boolean
}

export interface IChat extends Document {
  hostId: Types.ObjectId; 
  userId: Types.ObjectId; 
  latestMessage:ObjectId,
  createdAt?: Date; 
  updatedAt?: Date;  
}




export interface IChatingUser {
    _id: ObjectId;
    host?: {
      _id: ObjectId; 
      workshopName: string; 
      logoUrl?:string
    }
    user?: {
      _id: ObjectId; 
      name: string; 
      logoUrl: string; 
    };
    newMessage?:{message:string,updatedAt:Date}
    message:any[]
  }