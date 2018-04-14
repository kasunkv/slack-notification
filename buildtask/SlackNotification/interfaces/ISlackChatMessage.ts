export interface ISlackChatMessage {
    send(): Promise<string>;
}