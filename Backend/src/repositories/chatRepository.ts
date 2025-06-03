import mongoose from "mongoose";
import chatModel from "../db/models/chatSchema";
import { IChatRepo } from "../Adapters/interfaces/chatInterface/IChatRepo";
import { IChatingUser } from "../Adapters/interfaces/chatInterface/IChatSchema";
import messageModel from "../db/models/messageSchema";
import User from "../db/models/userSchema";
import Host from "../db/models/hostSchema";
import { customError } from "../Adapters/middlewares/errorHandling";
import HttpStatus from "../Adapters/interfaces/statusCodes";

class ChatRepo implements IChatRepo {
    
  constructor() { }
  async getChatid(
    hostId: string,
    userid: string
  ): Promise<{ success?: boolean; id?: string }> {
    try {
      const chatExist = await chatModel.findOne({
        hostId: new mongoose.Types.ObjectId(hostId),
        userId: new mongoose.Types.ObjectId(userid),
      });
      if (chatExist) {
        console.log("chat exist")
        return { success: true, id: chatExist._id + "" };
      } else {
        const createChat = {
          hostId: hostId,
          userId: userid,
        };
        const create = await chatModel.create(createChat);
        return { success: true, id: create._id + "" };
      }
    } catch (error: any) {
      console.log("err", error);

      throw new customError(error.message, error.statusCode);
    }
  }

  async getChatOfOneToOne(
    chatId: string,
    whoWantsData: "user" | "host" | string
  ): Promise<{ success?: boolean; data?: IChatingUser }> {
    try {
      const update = await messageModel.updateMany(
        {
          $and: [
            { chatId: new mongoose.Types.ObjectId(chatId) },
            { sender: whoWantsData === "user" ? "host" : "user" },
          ],
        },
        { $set: { seen: true } }
      );

      const [chatBetweenUsers] = await chatModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(chatId) } },
        {
          $lookup: {
            from: "hosts",
            localField: "hostId",
            foreignField: "_id",
            as: "host",
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "_id",
            foreignField: "chatId",
            as: "messages",
          },
        },
        { $unwind: "$user" },
        { $unwind: "$host" },
        {
          $project: {
            _id: 1,
            messages: 1,
            "user.firstName": 1,
            "user.profileImage": 1,
            "user._id": 1,
            "host._id": 1,
            "host.firstName": 1,
            "host.profileImage": 1,
          },
        },
      ]);
      console.log("chatBetweenUsers",chatBetweenUsers)

      return { success: true, data: chatBetweenUsers };
    } catch (error: any) {
      throw new customError(error.message, error.statusCode);
    }
  }

  async updateChats(
    topassChat: string,
    whotosendthesechatid: string
  ): Promise<{ success?: boolean; chats?: IChatingUser[] }> {
    try {
      const data: IChatingUser[] = await chatModel.aggregate([
        {
          $match: {
            [`${topassChat === "user" ? "userId" : "hostId"}`]:
              new mongoose.Types.ObjectId(whotosendthesechatid),
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "latestMessage",
            foreignField: "_id",
            as: "newMessage",
          },
        },
        { $unwind: { path: "$newMessage", preserveNullAndEmptyArrays: true } },
        { $sort: { "newMessage.createdAt": -1 } },
        {
          $lookup: {
            from: `${topassChat === "user" ? "hosts" : "users"}`,
            localField: `${topassChat === "user" ? "hostId" : "userId"}`,
            foreignField: "_id",
            as: `${topassChat === "user" ? "host" : "user"}`,
          },
        },
        {
          $unwind: {
            path: `${topassChat === "user" ? "$host" : "$user"}`,
          },
        },
        {
          $project: {
            _id: 1,
            ...(topassChat === "user"
              ? {
                "host._id": 1,
                "host.firstName": 1,
                "host.profileImage": 1,
              }
              : {
                "user.name": 1,
                "user.profileImage": 1,
                "user._id": 1,
              }),
            "newMessage.message": 1,
            "newMessage.updatedAt": 1,
          },
        },
      ]);

      return { success: true, chats: data ? data : [] };
    } catch (error: any) {
      throw new customError(error.message, error.statusCode);
    }
  }

  async fetchChats(
    whom: string,
    id: string
  ): Promise<{ success?: boolean; chats: IChatingUser[] }> {
    try {
      const data: IChatingUser[] = await chatModel.aggregate([
        {
          $match: {
            [`${whom === "user" ? "userId" : "hostId"}`]:
              new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "latestMessage",
            foreignField: "_id",
            as: "newMessage",
          },
        },
        { $unwind: { path: "$newMessage", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: `${whom === "user" ? "hosts" : "users"}`,
            localField: `${whom === "user" ? "hostId" : "userId"}`,
            foreignField: "_id",
            as: `${whom === "user" ? "host" : "user"}`,
          },
        },
        {
          $unwind: {
            path: `${whom === "user" ? "$host" : "$user"}`,
          },
        },
        {
          $project: {
            _id: 1,
            ...(whom === "user"
              ? {
                "host._id": 1,
                "host.firstName": 1,
                "host.profileImage": 1,
              }
              : {
                "user.name": 1,
                "user.profileImage": 1,
                "user._id": 1,
              }),
            "newMessage.message": 1,
            "newMessage.updatedAt": 1,
          },
        },
      ]);

      return { success: true, chats: data };
    } catch (error: any) {
      throw new customError(error.message, error.statusCode);
    }
  }

  async addNewMessage(
    sender: string,
    chatId: string,
    message: string
  ): Promise<{ success?: boolean; messageCreated: any }> {
    try {
      const createdMesage = await messageModel.create({
        sender: sender,
        chatId: chatId,
        message: message, 
      });
      const update = await chatModel.updateOne({_id:new mongoose.Types.ObjectId(chatId)},{
        latestMessage: createdMesage._id,
      });
      
      return { success: true, messageCreated: createdMesage };
    } catch (error: any) {
      throw new customError(error.message, error.statusCode);
    }
  }

  async liveMessageSeen(messageId: string): Promise<{ success?: boolean }> {
    try {
      const updateOne = await messageModel.updateOne(
        { _id: new mongoose.Types.ObjectId(messageId) },
        {
          $set: {
            seen: true,
          },
        }
      );
      if (updateOne.modifiedCount === 0) {
        throw new customError("", HttpStatus.NO_CONTENT);
      }
      return { success: true };
    } catch (error: any) {
      throw new customError(error.message, error.statusCode);
    }
  }

  async getCalleData(
    id: string,
    hostOrUser: string
  ): Promise<{
    data: { name?: string; logUrl?: string; firstName?: string };
  }> {
    try {
      const [Data] =
        hostOrUser === "user"
          ? await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            { $project: { _id: 0, name: 1, logoUrl: 1 } },
          ])
          : await Host.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            { $project: { _id: 0, firstName: 1, logoUrl: 1 } },
          ]);
      console.log(Data);

      return { data: Data };
    } catch (error: any) {
      throw new customError(error.message, error.statusCode);
    }
  }
}

export default ChatRepo;
