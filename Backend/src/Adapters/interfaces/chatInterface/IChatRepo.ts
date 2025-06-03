import { IChatingUser } from "./IChatSchema";

export interface IChatRepo {
    getChatid(
        hostId: string,
        userid: string
    ): Promise<{ success?: boolean; id?: string }>;
    getChatOfOneToOne(
        chatId: string,
        whoWantsData: "user" | "host" | string
    ): Promise<{ success?: boolean; data?: IChatingUser }>;
    fetchChats(
        whom: string,
        id: string
    ): Promise<{ success?: boolean; chats: IChatingUser[] }>;
    updateChats(
        topassChat: string,
        whotosendthesechatid: string
    ): Promise<{ success?: boolean; chats?: IChatingUser[] }>;
    addNewMessage(
        sender: string,
        chatId: string,
        message: string
    ): Promise<{ success?: boolean; messageCreated: any }>;
    liveMessageSeen(messageId: string): Promise<{ success?: boolean }>;
    getCalleData(
        id: string,
        hostOrUser: string
    ): Promise<{
        data: { name?: string; logUrl?: string; workshopName?: string };
    }>;
}
