import { WebClient } from '@slack/web-api';

export interface ISlackClient {
    getInstance(): WebClient;
}