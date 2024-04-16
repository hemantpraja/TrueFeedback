import { Message } from "@/models/message.model";

export interface ApiResonse {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>
}