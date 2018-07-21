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
        const promise: Promise<string> = new Promise<string>(async (resolve, reject) => {
            try {
                const channelIds: Array<string> = await this._channelService.getChannelIds();
                const results: Array<Promise<string>> = new Array(channelIds.length);

                for (const channelId of channelIds) {
                    const result: Promise<string> = this.uploadFile(channelId);
                    results.push(result);
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