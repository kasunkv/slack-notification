import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import { WebClient, WebAPICallResult } from '@slack/client/dist';

import TYPES from './di/types';

import { ITaskInput } from './interfaces/ITaskInput';
import { ISlackClient } from './interfaces/ISlackClient';
import { ISlackFileUpload } from './interfaces/ISlackFileUpload';
import { ISlackChannelService } from './interfaces/ISlackChannelService';
import { ILogger } from './interfaces/ILogger';

@injectable()
export class SlackFileUpload implements ISlackFileUpload {

    private _client: WebClient;
    private _taskInput: ITaskInput;
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

    upload(): Promise<string> {
        const promise: Promise<string> = new Promise<string>(async (resolve, reject) => {
            try {
                const channelIds: Array<string> = await this._channelService.getChannelIds();
                const results: Array<Promise<string>> = new Array(channelIds.length);

                for (const channelId of channelIds) {
                    if (channelId) {
                        this._logger.logDebug(`[SlackFileUpload.upload()] Uploading file. Channel ID: ${channelId}`);
                        const result: Promise<string> = this.uploadFile(channelId);
                        results.push(result);
                    }
                }

                Promise
                    .all(results)
                    .then(() => {
                        resolve('All file uploads completed successfully.');
                    })
                    .catch(err => {
                        reject(`One or more file uploads failed to complete. ${err.message || err}`);
                    });

            } catch (err) {
                reject(err.message || err);
            }
        });
        return promise;
    }

    private uploadFile(channelId: string): Promise<string> {
        const promise = new Promise<string>(async (resolve, reject) => {
            try {
                const result: WebAPICallResult = await this._client.files.upload({
                    channels: channelId,
                    file: fs.createReadStream(this._taskInput.UploadFilePath),
                    filetype: 'auto',
                    title: this._taskInput.FileTitle,
                    initial_comment: this._taskInput.FileComment
                });

                if (result.ok) {
                    this._logger.logDebug(`[SlackFileUpload.uploadFile()] File uploaded to channelId: ${channelId} successfully.`);
                    resolve('File uploaded successfully.');
                } else {
                    this._logger.logDebug(`[SlackChatMessage.uploadFile()] ChannelID: ${channelId} Error: ${result.error}`);
                    reject(`File upload failed. Error: ${result.error}`);
                }

            } catch (err) {
                reject(err.message || err);
            }
        });
        return promise;
    }
}