import * as Task from 'vsts-task-lib';
import { injectable } from 'inversify';

import { ITaskInput } from './interfaces/ITaskInput';

@injectable()
export class TaskInput implements ITaskInput {
    private _messageAuthor: string;
    private _channel: string;
    private _message: string;
    private _useVariableForMessage: boolean;
    private _slackApiToken: string;
    private _iconUrl: string;
    private _authorName: string;
    private _authorLink: string;
    private _title: string;
    private _titleLink: string;
    private _preText: string;
    private _useVariableForPreText: boolean;
    private _text: string;
    private _useVariableForText: boolean;
    private _color: string;
    private _imageUrl: string;
    private _footerText: string;
    private _footerIcon: string;
    private _showFooterTimestamp: boolean;
    private _notificationType: string;
    private _uploadFilePath: string;
    private _fileTitle: string;
    private _fileComment: string;

    constructor() {
        // Required Inputs
        this._messageAuthor = Task.getInput('MessageAuthor', true);
        this._channel = Task.getInput('Channel', true);
        this._slackApiToken = Task.getInput('SlackApiToken', true);
        this._uploadFilePath = Task.getInput('UploadFilePath');

        // Optional Inputs
        this._message = Task.getInput('Message');
        this._useVariableForMessage = Task.getBoolInput('UseVariableForMessage');
        this._iconUrl = Task.getInput('IconUrl');
        this._authorName = Task.getInput('AuthorName');
        this._authorLink = Task.getInput('AuthorLink');
        this._title = Task.getInput('Title');
        this._titleLink = Task.getInput('TitleLink');
        this._preText = Task.getInput('PreText');
        this._useVariableForPreText = Task.getBoolInput('UseVariableForPreText');
        this._text = Task.getInput('Text');
        this._useVariableForText = Task.getBoolInput('UseVariableForText');
        this._color = Task.getInput('Color');
        this._imageUrl = Task.getInput('ImageUrl');
        this._footerText = Task.getInput('FooterText');
        this._footerIcon = Task.getInput('FooterIcon');
        this._showFooterTimestamp = Task.getBoolInput('ShowFooterTimestamp');
        this._notificationType = Task.getInput('NotificationType');
        this._fileTitle = Task.getInput('FileTitle');
        this._fileComment = Task.getInput('FileComment');
    }

    get MessageAuthor(): string {
        if (this._messageAuthor) {
            return this._messageAuthor;
        }
        throw new Error('The Message Author is Required');
    }

    get Channel(): Array<string> {
        if (this._channel) {
            const channelList: Array<string> = this._channel.split(',').map((str: string) => str.trim());
            return channelList;
        }
        throw new Error('The Slack Channel Name/User Real Name is Required');
    }

    get Message(): string {
        if (this._message) {
            if (this._useVariableForMessage) {
                return Task.getVariable(this._message.trim());
            }
            return this.handleEscapeCharacters(this._message);
        }
        return '';
    }

    get UseVariableForMessage(): boolean {
        return this._useVariableForMessage;
    }

    get SlackApiToken(): string {
        if (this._slackApiToken) {
            return this._slackApiToken;
        }
        throw new Error('The Slack API Key is Required');
    }

    get IconUrl(): string {
        if (this._iconUrl) {
            return this._iconUrl;
        }
        return '';
    }

    get AuthorName(): string {
        if (this._authorName) {
            return this._authorName;
        }
        return '';
    }

    get AuthorLink(): string {
        if (this._authorLink) {
            return this._authorLink;
        }
        return '';
    }

    get Title(): string {
        if (this._title) {
            return this._title;
        }
        return '';
    }

    get TitleLink(): string {
        if (this._titleLink) {
            return this._titleLink;
        }
        return '';
    }

    get PreText(): string {
        if (this._preText) {
            if (this._useVariableForPreText) {
                return Task.getVariable(this._preText.trim());
            }
            return this.handleEscapeCharacters(this._preText);
        }
        return '';
    }

    get UseVariableForPreText(): boolean {
        return this._useVariableForPreText;
    }

    get Text(): string {
        if (this._text) {
            if (this._useVariableForText) {
                return Task.getVariable(this._text.trim());
            }
            return this.handleEscapeCharacters(this._text);
        }
        return '';
    }

    get UseVariableForText(): boolean {
        return this._useVariableForText;
    }

    get Color(): string {
        if (this._color) {
            return this._color;
        }
        return '';

    }

    get ImageUrl(): string {
        if (this._imageUrl) {
            return this._imageUrl;
        }
        return '';
    }

    get FooterText(): string {
        if (this._footerText) {
            return this._footerText;
        }
        return '';
    }

    get FooterIcon(): string {
        if (this._footerIcon) {
            return this._footerIcon;
        }
        return '';
    }

    get ShowFooterTimestamp(): boolean {
        return this._showFooterTimestamp;
    }

    get NotificationType(): string {
        if (this._notificationType) {
            return this._notificationType;
        }
        return 'ChatMessage';
    }

    get UploadFilePath(): string {
        if (this._uploadFilePath) {
            return this._uploadFilePath;
        }
        throw new Error('The Path to the File to Upload is Required');
    }

    get FileTitle(): string {
        if (this._fileTitle) {
            return this._fileTitle;
        }
        return '';
    }

    get FileComment(): string {
        if (this._fileComment) {
            return this._fileComment;
        }
        return '';
    }

    get TimeTicks(): string {
        const timeString: string = new Date().getTime().toString();
        const timeTicks: string = timeString.substring(0, timeString.length - 3);
        return timeTicks;
    }

    public toJSON(): string {
        const obj: object = {
            slackApiToken: '****************',
            messageAuthor: this._messageAuthor,
            channel: this._channel,
            uploadFilePath: this._uploadFilePath,
            message: this._message,
            useVariableForMessage: this._useVariableForMessage,
            iconUrl: this._iconUrl,
            authorName: this._authorName,
            authorLink: this._authorLink,
            title: this._title,
            titleLink: this._titleLink,
            preText: this._preText,
            useVariableForPreText: this._useVariableForPreText,
            text: this._text,
            useVariableForText: this._useVariableForText,
            color: this._color,
            imageUrl: this._imageUrl,
            footerText: this._footerText,
            footerIcon: this._footerIcon,
            showFooterTimestamp: this._showFooterTimestamp,
            notificationType: this._notificationType,
            fileTitle: this._fileTitle,
            fileComment: this._fileComment
        };

        return JSON.stringify(obj);
    }

    handleEscapeCharacters(input: string): string {
        return input
            .replace(new RegExp('`n', 'g'), '\n')
            .replace(new RegExp('`t', 'g'), '\t');
    }
}