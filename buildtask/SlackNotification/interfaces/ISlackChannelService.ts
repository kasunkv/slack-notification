export interface ISlackChannelService {
    getChannelIds(): Promise<Array<string>>;
}