export interface ISlackChannelService {
    getChannelId(): Promise<string>;
    getChannelIds(): Promise<Array<string>>;
}