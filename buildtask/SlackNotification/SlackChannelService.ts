import { inject, injectable } from 'inversify';
import { WebClient, WebAPICallResult } from '@slack/client/dist';

import TYPES from './di/types';

import { ITaskInput } from './interfaces/ITaskInput';
import { ISlackClient } from './interfaces/ISlackClient';
import { ISlackChannelService } from './interfaces/ISlackChannelService';
import { ILogger } from './interfaces/ILogger';

@injectable()
export class SlackChannelService implements ISlackChannelService {
  private _taskInput: ITaskInput;
  private _logger: ILogger;
  private _client: WebClient;

  constructor(
    @inject(TYPES.ISlackClient) slackClient: ISlackClient,
    @inject(TYPES.ILogger) logger: ILogger,
    @inject(TYPES.ITaskInput) taskInput: ITaskInput
  ) {
    this._client = slackClient.getInstance();
    this._taskInput = taskInput;
    this._logger = logger;
  }

  getChannelIds(): Promise<Array<string>> {
    const promise: Promise<Array<string>> = new Promise<Array<string>>(async (resolve, reject) => {
      try {
        const channels: Array<string> = this._taskInput.Channel;
        let userId: string = '';
        let result: any = null;
        const channelIds: Array<string> = new Array(channels.length);

        this._logger.logDebug(`[SlackChannelService.getChannelIds()] Channels/Users found: ${channels.length}`);

        for (const channel of channels) {
          this._logger.logDebug(`[SlackChannelService.getChannelIds()] Channel name: ${channel}`);

          switch (channel.charAt(0)) {
            case '#':
              channelIds.push(channel);
              userId = '';
              break;

            case '@':
              userId = await this.getUserIdByName(channel.substr(1, channel.length));
              break;

            default:
              userId = await this.getUserIdByRealNameOrDisplayName(channel);
              break;
          }

          if (userId !== '') {
            result = await this.getSlackChannelIdByUserId(userId);
            const channelId: string = result.channel.id;
            channelIds.push(channelId);

            this._logger.logDebug(`[SlackChannelService.getChannelIds()] Channel name: ${channel} | UserId: ${userId} | ChannelId: ${channelId}`);
          }
        }

        this._logger.logDebug(`[SlackChannelService.getChannelIds()] ChannelID count: ${channelIds.length}`);
        resolve(channelIds);

      } catch (err) {
        reject(err.message || err);
      }
    });
    return promise;
  }

  private getUserIdByRealNameOrDisplayName(name: string): Promise<string> {
    const promise: Promise<string> = new Promise<string>(async (resolve, reject) => {
      try {
        const users: Array<any> = await this.getSlackUserListAsArray();
        users.forEach(user => {
          if (user.real_name === name || user.profile.display_name === name) {
            this._logger.logDebug(`[SlackChannelService.getUserIdByRealNameOrDisplayName()] User found: ${name} with real_name: ${user.real_name} or display_name: ${user.profile.display_name}`);
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
              this._logger.logDebug(`[SlackChannelService.getUserIdByName()]User found: ${name} with id ${user.id}`);
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
