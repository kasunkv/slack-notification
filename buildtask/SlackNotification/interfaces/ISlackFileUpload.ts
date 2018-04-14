export interface ISlackFileUpload {
    upload(): Promise<string>;
}