import { inject, injectable } from 'inversify';
import { WebClient } from '@slack/client';

import TYPES from './di/types';
import { ISlackClient } from './interfaces/ISlackClient';
import { ITaskInput } from './interfaces/ITaskInput';

@injectable()
export class SlackClient implements ISlackClient {

    private _client: WebClient;
    private _taskInputs: ITaskInput;

    constructor(
        @inject(TYPES.ITaskInput) taskInput: ITaskInput
    ) {
        this._taskInputs = taskInput;
        this._client = new WebClient(this._taskInputs.SlackApiToken);
    }

    getInstance(): WebClient {
        if (this._client !== null) {
            return this._client;
        }
        return new WebClient(this._taskInputs.SlackApiToken);
    }    
}