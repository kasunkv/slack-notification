import { Container } from 'inversify';
import 'reflect-metadata';

import { ITaskInput } from '../interfaces/ITaskInput';
import { ISlackClient } from '../interfaces/ISlackClient';
import { ISlackFileUpload } from '../interfaces/ISlackFileUpload';
import { ISlackChatMessage } from '../interfaces/ISlackChatMessage';
import { ISlackChannelService } from '../interfaces/ISlackChannelService';
import { ILogger } from '../interfaces/ILogger';
import { IMonitoring } from '../interfaces/IMonitoring';

import TYPES from './types';

import { TaskInput } from '../TaskInput';
import { SlackClient } from '../SlackClient';
import { SlackFileUpload } from '../SlackFileUpload';
import { SlackChatMessage } from '../SlackChatMessage';
import { SlackChannelService } from './../SlackChannelService';
import { Logger } from '../Logger';
import { Monitoring } from '../Monitoring';

const container = new Container();

container.bind<ITaskInput>(TYPES.ITaskInput).to(TaskInput).inSingletonScope();
container.bind<ISlackClient>(TYPES.ISlackClient).to(SlackClient).inSingletonScope();
container.bind<ISlackChatMessage>(TYPES.ISlackChatMessage).to(SlackChatMessage).inTransientScope();
container.bind<ISlackFileUpload>(TYPES.ISlackFileUpload).to(SlackFileUpload).inTransientScope();
container.bind<ISlackChannelService>(TYPES.ISlackChannelService).to(SlackChannelService).inTransientScope();
container.bind<ILogger>(TYPES.ILogger).to(Logger).inTransientScope();
container.bind<IMonitoring>(TYPES.IMonitoring).to(Monitoring).inSingletonScope();

export default container;