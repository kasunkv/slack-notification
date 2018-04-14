import * as fs from 'fs';
import { inject } from 'inversify';
import { WebClient, WebAPICallResult } from '@slack/client/dist';

import TYPES from './types';

import { ITaskInput } from './interfaces/ITaskInput';
import { ISlackClient } from './interfaces/ISlackClient';
import { ISlackFileUpload } from './interfaces/ISlackFileUpload';

export class SlackFileUpload implements ISlackFileUpload {
    
    private _client: WebClient;
    private _taskInput: ITaskInput;
    
    constructor(
        @inject(TYPES.ISlackClient) slackClient: ISlackClient,
        @inject(TYPES.ITaskInput) taskInput: ITaskInput
    ) {
        this._client = slackClient.getInstance();
        this._taskInput = taskInput;
    }

    upload(): Promise<string> {
        const promise = new Promise<string>(async (resolve, reject) => {
            try {

                await this._client.files.upload({
                    channels: this._taskInput.Channel,
                    file: fs.createReadStream(this._taskInput.UploadFilePath),
                    filetype: 'auto',
                    title: this._taskInput.FileTitle,
                    initial_comment: this._taskInput.FileComment
                })
                .then((res: WebAPICallResult) => {
                    if (res.ok) {
                        resolve('File Uploaded Successfully.');
                    } else {
                        reject('File Upload Failed.');
                    }
                })
                .catch(err => {
                    reject(err.message || err);
                });
                
            } catch (err) {
                reject(err);
            }
        });
        return promise;
    }
}