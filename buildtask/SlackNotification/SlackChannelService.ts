import { inject, injectable } from 'inversify';
import { WebClient, WebAPICallResult } from '@slack/client/dist';

import TYPES from './di/types';

import { ITaskInput } from './interfaces/ITaskInput';
import { ISlackClient } from './interfaces/ISlackClient';
import { ISlackChannelService } from './interfaces/ISlackChannelService';
import { DestinationType, UserIdType } from './Constants';

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

  getChannelIds(): Promise<Array<string>> {
    const promise: Promise<Array<string>> = new Promise<Array<string>>(async (resolve, reject) => {
      try {
        const channels: Array<string> = this._taskInput.ChannelNew;
        let channelId: string = '';
        const channelIds: Array<string> = new Array(channels.length);

        for (const channel of channels) {
          switch (channel.charAt(0)) {
            case '#':
              channelIds.push(channel);
              break;

            case '@':
              channelId = await this.getUserIdByName(channel.substr(1, channel.length));
              channelIds.push(channelId);
              break;

            default:
              channelId = await this.getUserIdByRealNameOrDisplayName(channel);
              channelIds.push(channelId);
              break;
          }
        }
        resolve(channelIds);
      } catch (err) {
        reject(err.message || err);
      }
    });
    return promise;
  }

  // getChannelId(): Promise<string> {
  //   const promise: Promise<string> = new Promise(async (resolve, reject) => {
  //     try {
  //       if (this._taskInput.Destination === DestinationType.CHANNEL) {
  //         resolve(this._taskInput.Channel);
  //       } else {
  //         let userId: string = UserIdType.NAME;

  //         switch (this._taskInput.UserIdType) {
  //           case UserIdType.NAME:
  //             userId = await this.getUserIdByName(this._taskInput.Channel);
  //             break;
  //           case UserIdType.DISPLAY_NAME:
  //             userId = await this.getUserIdByDisplayName(this._taskInput.Channel);
  //             break;
  //           case UserIdType.REAL_NAME:
  //             userId = await this.getUserIdByRealName(this._taskInput.Channel);
  //             break;
  //         }

  //         const result: any = await this.getSlackChannelIdByUserId(userId);
  //         resolve(result.channel.id);
  //       }
  //     } catch (err) {
  //       reject(err.message || err);
  //     }
  //   });
  //   return promise;
  // }

  private getUserIdByRealNameOrDisplayName(name: string): Promise<string> {
    const promise: Promise<string> = new Promise<string>(async (resolve, reject) => {
      try {
        const users: Array<any> = await this.getSlackUserListAsArray();
        users.forEach(user => {
          if (user.real_name === name || user.profile.display_name === name) {
            resolve(user.id);
          }
        });
      } catch (err) {
        reject(err.message || err);
      }
    });
    return promise;
  }

  private getUserIdByRealName(name: string): Promise<string> {
    const promise: Promise<string> = new Promise<string>(
      async (resolve, reject) => {
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
      }
    );
    return promise;
  }

  private getUserIdByDisplayName(name: string): Promise<string> {
    const promise: Promise<string> = new Promise<string>(
      async (resolve, reject) => {
        try {
          const users: Array<any> = await this.getSlackUserListAsArray();
          users.forEach(user => {
            if (user.profile.display_name === name) {
              resolve(user.id);
            }
          });
        } catch (err) {
          reject(err.message || err);
        }
      }
    );
    return promise;
  }

  private getUserIdByName(name: string): Promise<string> {
    const promise: Promise<string> = new Promise<string>(
      async (resolve, reject) => {
        try {
          const users: Array<any> = await this.getSlackUserListAsArray();
          users.forEach(user => {
            if (user.name === name) {
              resolve(user.id);
            }
          });
        } catch (err) {
          reject(err.message || err);
        }
      }
    );
    return promise;
  }

  private getSlackUserListAsArray(): Promise<Array<any>> {
    const promise: Promise<Array<any>> = new Promise(
      async (resolve, reject) => {
        try {
          let cursor: string = '';
          const slackUsers: Array<any> = new Array();

          do {
            const users: WebAPICallResult | any = await this.getSlackUsersList(
              cursor
            );
            users.members.forEach((member: any) => {
              slackUsers.push(member);
            });
            cursor = users.response_metadata.next_cursor;
          } while (!this.isNullOrEmpty(cursor));

          resolve(slackUsers);
        } catch (err) {
          reject(err.message || err);
        }
      }
    );
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
    return str === null || str === undefined || str.length === 0;
  }
}
