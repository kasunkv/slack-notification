import { inject, injectable } from 'inversify';
import { WebClient, WebAPICallResult } from '@slack/client/dist';

import TYPES from './di/types';

import { ITaskInput } from './interfaces/ITaskInput';
import { ISlackClient } from './interfaces/ISlackClient';
import { ISlackChatMessage } from './interfaces/ISlackChatMessage';
import { ISlackChannelService } from './interfaces/ISlackChannelService';

@injectable()
export class SlackChatMessage implements ISlackChatMessage {

    private _taskInput: ITaskInput;
    private _client: WebClient;
    private _channelService: ISlackChannelService;

    constructor(
        @inject(TYPES.ISlackClient) slackClient: ISlackClient,
        @inject(TYPES.ITaskInput) taskInput: ITaskInput,
        @inject(TYPES.ISlackChannelService) slackChannelService: ISlackChannelService
    ) {
        this._client = slackClient.getInstance();
        this._taskInput = taskInput;
        this._channelService = slackChannelService;
    }

    send(): Promise<string> {
        const promise = new Promise<string>(async (resolve, reject) => {
            try {
                const channelId: string = await this._channelService.getChannelId();
                const result: WebAPICallResult = await this._client.chat.postMessage({
                    channel: channelId,
                    text: this._taskInput.Message,
                    icon_url: this._taskInput.IconUrl,
                    username: this._taskInput.MessageAuthor,
                    unfurl_links: true,
                    attachments: [
                        {
                            title: this._taskInput.Title,
                            title_link: this._taskInput.TitleLink,
                            author_name: this._taskInput.AuthorName,
                            author_link: this._taskInput.AuthorLink,
                            pretext: this._taskInput.PreText,
                            text: this._taskInput.Text,
                            color: this._taskInput.Color,
                            image_url: this._taskInput.ImageUrl,
                            footer: this._taskInput.FooterText,
                            footer_icon: this._taskInput.FooterIcon,
                            ts: this._taskInput.ShowFooterTimestamp ? this._taskInput.TimeTicks : ''
                        }
                    ]
                });

                if (result.ok) {
                    resolve('Chat Message Posted Successfully.');
                } else {
                    reject(`Posting Chat Message Failed. Error: ${result.error}`);
                }

            } catch (err) {
                reject(err.message || err);
            }
        });
        return promise;
    }

}