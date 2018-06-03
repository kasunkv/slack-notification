import { Container } from 'inversify';
import 'reflect-metadata';

import { ITaskInput } from '../interfaces/ITaskInput';
import { ISlackClient } from '../interfaces/ISlackClient';
import { ISlackFileUpload } from '../interfaces/ISlackFileUpload';
import { ISlackChatMessage } from '../interfaces/ISlackChatMessage';
import { ISlackChannelService } from '../interfaces/ISlackChannelService';

import TYPES from './types';

import { TaskInput } from '../TaskInput';
import { SlackClient } from '../SlackClient';
import { SlackFileUpload } from '../SlackFileUpload';
import { SlackChatMessage } from '../SlackChatMessage';
import { SlackChannelService } from './../SlackChannelService';

const container = new Container();

container.bind<ITaskInput>(TYPES.ITaskInput).to(TaskInput).inSingletonScope();
container.bind<ISlackClient>(TYPES.ISlackClient).to(SlackClient).inSingletonScope();
container.bind<ISlackChatMessage>(TYPES.ISlackChatMessage).to(SlackChatMessage).inTransientScope();
container.bind<ISlackFileUpload>(TYPES.ISlackFileUpload).to(SlackFileUpload).inTransientScope();
container.bind<ISlackChannelService>(TYPES.ISlackChannelService).to(SlackChannelService).inTransientScope();

export default container;