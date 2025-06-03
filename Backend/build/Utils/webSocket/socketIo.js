"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIntalization = void 0;
const socket_io_1 = require("socket.io");
const chatRepository_1 = __importDefault(require("../../repositories/chatRepository"));
const chatInteractor_1 = __importDefault(require("../../Interactors/chatInteractor"));
const userSchema_1 = __importDefault(require("../../db/models/userSchema"));
const hostRepository_1 = require("../../repositories/hostRepository");
const userInteractor_1 = require("../../Interactors/userInteractor");
const hostInteractor_1 = require("../../Interactors/hostInteractor");
const chatRepo = new chatRepository_1.default();
const chatInteractor = new chatInteractor_1.default(chatRepo);
const userRepo = new userSchema_1.default();
const userinteractor = new userInteractor_1.userInteractor(userRepo);
const hostRepo = new hostRepository_1.hostRepository();
const hostinteractor = new hostInteractor_1.hostInteractor(hostRepo);
const usersAndHostsSocketId = {};
const SocketIntalization = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
        },
    });
    io.on("connection", (socket) => {
        console.log("userConnected", socket.id);
        const loggedUserId = socket.handshake.query.loggedUserId; //making user active
        if (loggedUserId) {
            usersAndHostsSocketId[loggedUserId + ""] = socket.id;
            console.log("usersAndHostsSocketid", usersAndHostsSocketId);
            io.emit("setup", { id: loggedUserId });
            console.log("emitted setup");
        }
        socket.on("join-chat", (chatId) => {
            console.log("user joined chat", chatId);
            socket.join(chatId);
        });
        socket.on("send-message", (messageDetails) => {
            console.log("mess", messageDetails);
            chatInteractor
                .addNewMessage(messageDetails.sender, messageDetails.chatId, messageDetails.message)
                .then((response) => {
                io.to(messageDetails.chatId).emit("receivemessage", {
                    response: response.messageCreated,
                });
                // if (messageDetails.sender === "host") {
                //   userinteractor
                //     .notificationCountUpdater(messageDetails.recieverId)
                //     .then((response) => {
                //       if (usersAndHostsSocketId[messageDetails.recieverId]) {
                //         io.to(
                //           usersAndHostsSocketId[messageDetails.recieverId]
                //         ).emit("notifictaionUpdated", response);
                //       }
                //     });
                //   userinteractor
                //     .notificationsGetter(messageDetails.recieverId)
                //     .then((response) => {
                //       if (usersAndHostsSocketId[messageDetails.recieverId]) {
                //         io.to(
                //           usersAndHostsSocketId[messageDetails.recieverId]
                //         ).emit("gettNotification", response);
                //       }
                //     });
                // } else if (messageDetails.sender === "user") {
                //   hostinteractor
                //     .notificationCountUpdater(messageDetails.recieverId)
                //     .then((response) => {
                //       if (usersAndHostsSocketId[messageDetails.recieverId]) {
                //         io.to(
                //           usersAndHostsSocketId[messageDetails.recieverId]
                //         ).emit("notifictaionUpdated", response);
                //       }
                //     });
                //   hostinteractor
                //     .notificationsGetter(messageDetails.recieverId)
                //     .then((response) => {
                //       if (usersAndHostsSocketId[messageDetails.recieverId]) {
                //         io.to(
                //           usersAndHostsSocketId[messageDetails.recieverId]
                //         ).emit("gettNotification", response);
                //       }
                //     });
                // }
            });
        });
        socket.on("isTyping", (data) => {
            io.to(data.chatid).emit("typing", data);
        });
        socket.on("oppositeGuysIsInOnlineOrNot", (data) => {
            if (usersAndHostsSocketId[data.userId]) {
                io.to(usersAndHostsSocketId[data.emitTo]).emit("isOnline", {
                    online: true,
                });
                // if (data.whom === "user") {
                //   console.log("data.userId", data.emitTo);
                //   userinteractor
                //     .notificationCountUpdater(data.emitTo)
                //     .then((response) => {
                //       if (usersAndHostsSocketId[data.emitTo]) {
                //         io.to(usersAndHostsSocketId[data.emitTo]).emit(
                //           "notifictaionUpdated",
                //           response
                //         );
                //       }
                //     });
                // }
            }
            else {
                io.to(usersAndHostsSocketId[data.emitTo]).emit("isOnline", {
                    online: false,
                });
            }
        });
        socket.on("disconnect", () => {
            const userIdToDisconnect = Object.keys(usersAndHostsSocketId).find((key) => {
                return usersAndHostsSocketId[key] === socket.id;
            });
            if (userIdToDisconnect) {
                delete usersAndHostsSocketId[userIdToDisconnect];
                if (!usersAndHostsSocketId[userIdToDisconnect]) {
                    io.emit("userOffline", { online: false, id: userIdToDisconnect });
                }
            }
        });
        socket.on("checkOnlineorNot", ({ userid, hostid, checker }) => {
            if (checker === "host") {
                console.log("usersAndHostsSocketId[userid]", usersAndHostsSocketId[userid]);
                if (usersAndHostsSocketId[userid]) {
                    io.to(usersAndHostsSocketId[hostid]).emit("checkedUserIsOnlineOrNot", { success: true });
                }
                else {
                    io.to(usersAndHostsSocketId[hostid]).emit("checkedUserIsOnlineOrNot", { success: false });
                }
            }
            if (checker === "user") {
                if (usersAndHostsSocketId[hostid]) {
                    io.to(usersAndHostsSocketId[userid]).emit("checkedUserIsOnlineOrNot", { success: true });
                }
                else {
                    io.to(usersAndHostsSocketId[userid]).emit("checkedUserIsOnlineOrNot", { success: false });
                }
            }
        });
        socket.on("getChatidForCreatingRoom", ({ userid, hostid, getter, whomTocall, callerData }) => {
            chatInteractor.getChatid(hostid, userid).then((response) => {
                socket.join(response.id + "");
                io.to(usersAndHostsSocketId[whomTocall]).emit("incomingcall", {
                    success: true,
                    getter: getter,
                    chatid: response.id,
                    callerData: callerData,
                });
            });
        });
        socket.on("Accepted", (data) => {
            socket.join(data.chatid);
            io.to(usersAndHostsSocketId[data.getter]).emit("callaccepted", data);
        });
        socket.on("sendOffer", ({ receiver, offer, senderid, callerData }) => {
            io.to(usersAndHostsSocketId[receiver]).emit("sendOfferToReceiver", {
                offer,
                senderid,
                callerData,
            });
        });
        socket.on("sendCandidate", ({ event, recieverid }) => {
            io.to(usersAndHostsSocketId[recieverid]).emit("recieveCandidate", {
                event,
            });
        });
        socket.on("updateMessageseen", async ({ messageId }) => {
            await chatInteractor.liveMessageSeen(messageId);
        });
    });
};
exports.SocketIntalization = SocketIntalization;
