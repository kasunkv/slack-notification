export interface ITaskInput {
    MessageAuthor: string;
    Destination: string;
    UserIdType: string;
    Channel: string;
    ChannelNew: Array<string>;
    Message: string;
    SlackApiToken: string;

    IconUrl: string;
    AuthorName: string;
    AuthorLink: string;
    Title: string;
    TitleLink: string;
    PreText: string;
    Text: string;
    Color: string;
    ImageUrl: string;
    FooterText: string;
    FooterIcon: string;
    ShowFooterTimestamp: boolean;

    NotificationType: string;
    UploadFilePath: string;
    FileTitle: string;
    FileComment: string;

    TimeTicks: string;

    toJSON(): string;
}