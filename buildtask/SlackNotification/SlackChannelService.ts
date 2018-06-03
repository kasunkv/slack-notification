import { inject, injectable } from 'inversify';
import { WebClient, WebAPICallResult } from '@slack/client/dist';

import TYPES from './di/types';

import { ITaskInput } from './interfaces/ITaskInput';
import { ISlackClient } from './interfaces/ISlackClient';
import { ISlackChannelService } from './interfaces/ISlackChannelService';
import { DestinationType } from './Constants';


@injectable()
export class SlackChannelService implements ISlackChannelService {
    private _taskInput: ITaskInput;
    private _client: WebClient;

    constructor(
        @inject(TYPES.ISlackClient) slackClient: ISlackClient,
        @inject(TYPES.ITaskInput) taskInput: ITaskInput
    ) {
        this._client = slackClient.getInstance();
        this._taskInput = taskInput;
    }

    getChannelId(): Promise<string> {
        const promise: Promise<string> = new Promise(async (resolve, reject) => {
            try {
                if (this._taskInput.Destination === DestinationType.CHANNEL) {
                    resolve(this._taskInput.Channel);
                } else {
                    const userId: string = await this.getUserIdByRealName(this._taskInput.Channel);
                    const result: any = await this.getSlackChannelIdByUserId(userId);
                    resolve(result.channel.id);
                }
            } catch (err) {
                reject(err.message || err);
            }
        });
        return promise;
    }

    private getUserIdByRealName(name: string): Promise<string> {
        const promise: Promise<string> = new Promise(async (resolve, reject) => {
            try {
                const users: Array<any> = await this.getSlackUserListAsArray();
                users.forEach(user => {
                    if (user.real_name === name) {
                        resolve(user.id);
                    }
                });
            } catch (err) {
                reject(err.message || err);
            }
        });
        return promise;
    }

    private getSlackUserListAsArray(): Promise<Array<any>> {
        const promise: Promise<Array<any>> = new Promise(async (resolve, reject) => {
            try {
                let cursor: string = '';
                const slackUsers: Array<any> = new Array();

                do {
                    const users: WebAPICallResult | any = await this.getSlackUsersList(cursor);
                    users.members.forEach((member: any) => {
                        slackUsers.push(member);
                    });
                    cursor = users.response_metadata.next_cursor;
                } while (!this.isNullOrEmpty(cursor));

                resolve(slackUsers);
            } catch (err) {
                reject(err.message || err);
            }
        });
        return promise;
    }

    private getSlackUsersList(cursor: string): Promise<WebAPICallResult> {
        return this._client.users.list({
            limit: 50,
            cursor: cursor
        });
    }

    private getSlackChannelIdByUserId(userId: string): Promise<WebAPICallResult> {
        return this._client.im.open({
            user: userId
        });
    }

    private isNullOrEmpty(str: string): boolean {
        return (str === null) || (str === undefined) || (str.length === 0);
    }
}