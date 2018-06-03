import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import { WebClient, WebAPICallResult } from '@slack/client/dist';

import TYPES from './di/types';

import { ITaskInput } from './interfaces/ITaskInput';
import { ISlackClient } from './interfaces/ISlackClient';
import { ISlackFileUpload } from './interfaces/ISlackFileUpload';
import { ISlackChannelService } from './interfaces/ISlackChannelService';

@injectable()
export class SlackFileUpload implements ISlackFileUpload {

    private _client: WebClient;
    private _taskInput: ITaskInput;
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

    upload(): Promise<string> {
        const promise = new Promise<string>(async (resolve, reject) => {
            try {
                const channelId: string = await this._channelService.getChannelId();
                const result: WebAPICallResult = await this._client.files.upload({
                    channels: channelId,
                    file: fs.createReadStream(this._taskInput.UploadFilePath),
                    filetype: 'auto',
                    title: this._taskInput.FileTitle,
                    initial_comment: this._taskInput.FileComment
                });

                if (result.ok) {
                    resolve('File Uploaded Successfully.');
                } else {
                    reject(`File Upload Failed. Error: ${result.error}`);
                }

            } catch (err) {
                reject(err.message || err);
            }
        });
        return promise;
    }
}