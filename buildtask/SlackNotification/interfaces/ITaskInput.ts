export interface ITaskInput {
    MessageAuthor: string;
    Channel: string;
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

    NotificationType: string;
    UploadFilePath: string;
    FileTitle: string;
    FileComment: string;

    TimeTicks: string;
}