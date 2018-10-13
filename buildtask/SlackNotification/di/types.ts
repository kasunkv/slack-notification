import { IMonitoring } from '../interfaces/IMonitoring';
import { ILogger } from '../interfaces/ILogger';
import { ISlackChannelService } from '../interfaces/ISlackChannelService';
import { ISlackFileUpload } from '../interfaces/ISlackFileUpload';
import { ISlackChatMessage } from '../interfaces/ISlackChatMessage';
import { ISlackClient } from '../interfaces/ISlackClient';
import { ITaskInput } from '../interfaces/ITaskInput';

const TYPES = {
    ITaskInput: Symbol('ITaskInput'),
    ISlackClient: Symbol('ISlackClient'),
    ISlackChatMessage: Symbol('ISlackChatMessage'),
    ISlackFileUpload: Symbol('ISlackFileUpload'),
    ISlackChannelService: Symbol('ISlackChannelService'),
    ILogger: Symbol('ILogger'),
    IMonitoring: Symbol('IMonitoring')
};

export default TYPES;