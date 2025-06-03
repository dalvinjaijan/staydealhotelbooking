import { IChatingUser } from "../Adapters/interfaces/chatInterface/IChatSchema";
import { IChatInteractor } from "../Adapters/interfaces/chatInterface/IChatInteractor";
import { IChatRepo } from "../Adapters/interfaces/chatInterface/IChatRepo";
import { customError } from "../Adapters/middlewares/errorHandling";

class ChatInteractor implements IChatInteractor {
    constructor(private readonly chatRepo: IChatRepo) { }

    async getChatid(
        hostId: string,
        userid: string
    ): Promise<{ success?: boolean; id?: string }> {
        try {
            console.log("inside chat Interactor")
            const response = await this.chatRepo.getChatid(hostId, userid);
            return response;
        } catch (error: any) {
            throw new customError(error.message, error.statusCode);
        }
    }

    async getChatOfOneToOne(
        chatId: string,
        whoWantsData: "user" | "host" | string
    ): Promise<{ success?: boolean; data?: IChatingUser }> {
        try {
            const response = await this.chatRepo.getChatOfOneToOne(
                chatId,
                whoWantsData
            );
            return response;
        } catch (error: any) {
            throw new customError(error.message, error.statusCode);
        }
    }

    async fetchChats(
        whom: string,
        id: string
    ): Promise<{ success?: boolean; chats: IChatingUser[] }> {
        try {
            const response = await this.chatRepo.fetchChats(whom, id);
            return response;
        } catch (error: any) {
            throw new customError(error.message, error.statusCode);
        }
    }
    async updateChats(
        topassChat: string,
        whotosendthesechatid: string
    ): Promise<{ success?: boolean; chats?: IChatingUser[] }> {
        try {
            const response = await this.chatRepo.updateChats(
                topassChat,
                whotosendthesechatid
            );
            return response;
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
            const response = await this.chatRepo.addNewMessage(
                sender,
                chatId,
                message
            );
            return response;
        } catch (error: any) {
            console.log(error.message);

            throw new customError(error.message, error.statusCode);
        }
    }

    async liveMessageSeen(messageId: string): Promise<{ success?: boolean }> {
        try {
            const response = await this.chatRepo.liveMessageSeen(messageId);
            return response;
        } catch (error: any) {
            throw new customError(error.message, error.statusCode);
        }
    }

    async getCalleData(
        id: string,
        hostOrUser: string
    ): Promise<{
        data: { name?: string; logUrl?: string; workshopName?: string };
    }> {
        try {
            const response = await this.chatRepo.getCalleData(id, hostOrUser);
            return response;
        } catch (error: any) {
            throw new customError(error.message, error.statusCode);
        }
    }
}

export default ChatInteractor;
