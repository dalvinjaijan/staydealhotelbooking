"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema_1 = __importDefault(require("../db/models/chatSchema"));
const messageSchema_1 = __importDefault(require("../db/models/messageSchema"));
const userSchema_1 = __importDefault(require("../db/models/userSchema"));
const hostSchema_1 = __importDefault(require("../db/models/hostSchema"));
const errorHandling_1 = require("../Adapters/middlewares/errorHandling");
const statusCodes_1 = __importDefault(require("../Adapters/interfaces/statusCodes"));
class ChatRepo {
    constructor() { }
    async getChatid(hostId, userid) {
        try {
            const chatExist = await chatSchema_1.default.findOne({
                hostId: new mongoose_1.default.Types.ObjectId(hostId),
                userId: new mongoose_1.default.Types.ObjectId(userid),
            });
            if (chatExist) {
                console.log("chat exist");
                return { success: true, id: chatExist._id + "" };
            }
            else {
                const createChat = {
                    hostId: hostId,
                    userId: userid,
                };
                const create = await chatSchema_1.default.create(createChat);
                return { success: true, id: create._id + "" };
            }
        }
        catch (error) {
            console.log("err", error);
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
    async getChatOfOneToOne(chatId, whoWantsData) {
        try {
            const update = await messageSchema_1.default.updateMany({
                $and: [
                    { chatId: new mongoose_1.default.Types.ObjectId(chatId) },
                    { sender: whoWantsData === "user" ? "host" : "user" },
                ],
            }, { $set: { seen: true } });
            const [chatBetweenUsers] = await chatSchema_1.default.aggregate([
                { $match: { _id: new mongoose_1.default.Types.ObjectId(chatId) } },
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
            console.log("chatBetweenUsers", chatBetweenUsers);
            return { success: true, data: chatBetweenUsers };
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
    async updateChats(topassChat, whotosendthesechatid) {
        try {
            const data = await chatSchema_1.default.aggregate([
                {
                    $match: {
                        [`${topassChat === "user" ? "userId" : "hostId"}`]: new mongoose_1.default.Types.ObjectId(whotosendthesechatid),
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
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
    async fetchChats(whom, id) {
        try {
            const data = await chatSchema_1.default.aggregate([
                {
                    $match: {
                        [`${whom === "user" ? "userId" : "hostId"}`]: new mongoose_1.default.Types.ObjectId(id),
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
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
    async addNewMessage(sender, chatId, message) {
        try {
            const createdMesage = await messageSchema_1.default.create({
                sender: sender,
                chatId: chatId,
                message: message,
            });
            const update = await chatSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(chatId) }, {
                latestMessage: createdMesage._id,
            });
            return { success: true, messageCreated: createdMesage };
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
    async liveMessageSeen(messageId) {
        try {
            const updateOne = await messageSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(messageId) }, {
                $set: {
                    seen: true,
                },
            });
            if (updateOne.modifiedCount === 0) {
                throw new errorHandling_1.customError("", statusCodes_1.default.NO_CONTENT);
            }
            return { success: true };
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
    async getCalleData(id, hostOrUser) {
        try {
            const [Data] = hostOrUser === "user"
                ? await userSchema_1.default.aggregate([
                    { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
                    { $project: { _id: 0, name: 1, logoUrl: 1 } },
                ])
                : await hostSchema_1.default.aggregate([
                    { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
                    { $project: { _id: 0, firstName: 1, logoUrl: 1 } },
                ]);
            console.log(Data);
            return { data: Data };
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
}
exports.default = ChatRepo;
