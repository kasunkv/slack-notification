import { WebClient } from '@slack/client';

export interface ISlackClient {
    getInstance(): WebClient;         
}