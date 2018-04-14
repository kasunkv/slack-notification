import * as Task from 'vsts-task-lib';
import { ITaskInput } from './interfaces/ITaskInput';


class TaskInput implements ITaskInput {
    private _messageAuthor: string;
    private _channel: string;
    private _message: string;
    private _slackApiToken: string;
    private _iconUrl: string;
    private _authorName: string;
    private _authorLink: string;
    private _title: string;
    private _titleLink: string;
    private _preText: string;
    private _text: string;
    private _color: string;
    private _imageUrl: string;
    private _footerText: string;
    private _footerIcon: string;

    constructor() {
        // Required Inputs
        this._messageAuthor = Task.getInput('MessageAuthor', true);
        this._channel = Task.getInput('Channel', true);
        this._message = Task.getInput('Message', true);
        this._slackApiToken = Task.getInput('SlackApiToken', true);

        // Optional Inputs
        this._iconUrl = Task.getInput('IconUrl');
        this._authorName = Task.getInput('AuthorName');
        this._authorLink = Task.getInput('AuthorLink');
        this._title = Task.getInput('Title');
        this._titleLink = Task.getInput('TitleLink');
        this._preText = Task.getInput('PreText');
        this._text = Task.getInput('Text');
        this._color = Task.getInput('Color');
        this._imageUrl = Task.getInput('ImageUrl');
        this._footerText = Task.getInput('FooterText');
        this._footerIcon = Task.getInput('FooterIcon');
    }

    get MessageAuthor(): string {
        if(this._messageAuthor) {
            return this._messageAuthor;
        }
        throw new Error('The Message Author is Required');
    }

    get Channel(): string {
        if(this._channel) {
            return this._channel;
        }
        throw new Error('The Slack Channel Name is Required');
    }

    get Message(): string {
        if(this._message) {
            return this._message;
        }
        return '';
    }

    get SlackApiToken(): string {
        if(this._slackApiToken) {
            return this._slackApiToken;
        }
        throw new Error('The Slack API Key is Required');
    }

    get IconUrl(): string {
        if(this._iconUrl) {
            return this._iconUrl;
        }
        return '';
    }

    get AuthorName(): string {
        if(this._authorName) {
            return this._authorName;
        }
        return '';
    }
    
    get AuthorLink(): string {
        if(this._authorLink) {
            return this._authorLink;
        }
        return '';        
    }
    
    get Title(): string {
        if(this._title) {
            return this._title;
        }
        return '';
    }

    get TitleLink(): string {
        if(this._titleLink) {
            return this._titleLink;
        }
        return '';
    }

    get PreText(): string {
        if(this._preText) {
            return this._preText;
        }
        return '';
    }

    get Text(): string {
        if(this._text) {
            return this._text;
        }
        return '';
    }

    get Color(): string {
        if(this._color) {
            return this._color;
        }
        return '';
        
    }
    
    get ImageUrl(): string {
        if(this._imageUrl) {
            return this._imageUrl;
        }
        return '';
    }

    get FooterText(): string {
        if(this._footerText) {
            return this._footerText;
        }
        return '';
    }

    get FooterIcon(): string {
        if(this._footerIcon) {
            return this._footerIcon;
        }
        return '';
    }
    
}