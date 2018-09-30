import { inject, injectable } from 'inversify';
import { WebClient, WebAPICallResult } from '@slack/client/dist';

import TYPES from './di/types';

import { ITaskInput } from './interfaces/ITaskInput';
import { ISlackClient } from './interfaces/ISlackClient';
import { ISlackChatMessage } from './interfaces/ISlackChatMessage';
import { ISlackChannelService } from './interfaces/ISlackChannelService';
import { ILogger } from './interfaces/ILogger';

@injectable()
export class SlackChatMessage implements ISlackChatMessage {

    private _taskInput: ITaskInput;
    private _client: WebClient;
    private _channelService: ISlackChannelService;
    private _logger: ILogger;

    constructor(
        @inject(TYPES.ISlackClient) slackClient: ISlackClient,
        @inject(TYPES.ITaskInput) taskInput: ITaskInput,
        @inject(TYPES.ISlackChannelService) slackChannelService: ISlackChannelService,
        @inject(TYPES.ILogger) logger: ILogger
    ) {
        this._client = slackClient.getInstance();
        this._taskInput = taskInput;
        this._channelService = slackChannelService;
        this._logger = logger;
    }

    send(): Promise<string> {
        const promise = new Promise<string>(async (resolve, reject) => {
            try {
                const channelIds: Array<string> = await this._channelService.getChannelIds();
                const results: Array<Promise<string>> = new Array(channelIds.length);

                for (const channelId of channelIds) {
                    if (channelId) {
                        this._logger.logDebug(`[SlackChatMessage.Send()] Sending message Channel ID: ${channelId}`);
                        const result: Promise<string> = this.sendMessage(channelId);
                        results.push(result);
                    }
                }

                Promise
                    .all(results)
                    .then(() => {
                        resolve('All messages posted successfully.');
                    })
                    .catch(err => {
                        reject(`One or more messages failed to deliver. ${err.message || err}`);
                    });

            } catch (err) {
                reject(err.message || err);
            }
        });
        return promise;
    }

    private sendMessage(channelId: string): Promise<string> {
        const promise = new Promise<string>(async (resolve, reject) => {
            try {

                this._logger.logDebug(`[SlackChatMessage.sendMessage()] Message: ${this._taskInput.Message}`);
                this._logger.logDebug(`[SlackChatMessage.sendMessage()] Pre-Text: ${this._taskInput.PreText}`);
                this._logger.logDebug(`[SlackChatMessage.sendMessage()] Text: ${this._taskInput.Text}`);

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
                    this._logger.logDebug(`[SlackChatMessage.sendMessage()] Message sent to ${channelId}`);
                    resolve(`Chat message to channelId: ${channelId} posted successfully.`);
                } else {
                    this._logger.logDebug(`[SlackChatMessage.sendMessage()] ChannelID: ${channelId} Error: ${result.error}`);
                    reject(`Posting chat message failed. Error: ${result.error}`);
                }

            } catch (err) {
                reject(err.message || err);
            }
        });
        return promise;
    }

}