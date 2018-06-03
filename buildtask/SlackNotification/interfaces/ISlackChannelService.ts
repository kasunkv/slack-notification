export interface ISlackChannelService {
    getChannelId(): Promise<string>;
}