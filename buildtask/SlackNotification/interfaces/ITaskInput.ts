export interface ITaskInput {
    MessageAuthor: string;
    Channel: Array<string>;
    Message: string;
    UseVariableForMessage: boolean;
    SlackApiToken: string;

    IconUrl: string;
    AuthorName: string;
    AuthorLink: string;
    Title: string;
    TitleLink: string;
    PreText: string;
    UseVariableForPreText: boolean;
    Text: string;
    UseVariableForText: boolean;
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