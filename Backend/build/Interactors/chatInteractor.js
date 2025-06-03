"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandling_1 = require("../Adapters/middlewares/errorHandling");
class ChatInteractor {
    chatRepo;
    constructor(chatRepo) {
        this.chatRepo = chatRepo;
    }
    async getChatid(hostId, userid) {
        try {
            console.log("inside chat Interactor");
            const response = await this.chatRepo.getChatid(hostId, userid);
            return response;
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
    async getChatOfOneToOne(chatId, whoWantsData) {
        try {
            const response = await this.chatRepo.getChatOfOneToOne(chatId, whoWantsData);
            return response;
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
    async fetchChats(whom, id) {
        try {
            const response = await this.chatRepo.fetchChats(whom, id);
            return response;
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
    async updateChats(topassChat, whotosendthesechatid) {
        try {
            const response = await this.chatRepo.updateChats(topassChat, whotosendthesechatid);
            return response;
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
    async addNewMessage(sender, chatId, message) {
        try {
            const response = await this.chatRepo.addNewMessage(sender, chatId, message);
            return response;
        }
        catch (error) {
            console.log(error.message);
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
    async liveMessageSeen(messageId) {
        try {
            const response = await this.chatRepo.liveMessageSeen(messageId);
            return response;
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
    async getCalleData(id, hostOrUser) {
        try {
            const response = await this.chatRepo.getCalleData(id, hostOrUser);
            return response;
        }
        catch (error) {
            throw new errorHandling_1.customError(error.message, error.statusCode);
        }
    }
}
exports.default = ChatInteractor;
