import { IMonitoring } from '../interfaces/IMonitoring';
import { ILogger } from '../interfaces/ILogger';
import { ISlackChannelService } from '../interfaces/ISlackChannelService';
import { ISlackFileUpload } from '../interfaces/ISlackFileUpload';
import { ISlackChatMessage } from '../interfaces/ISlackChatMessage';
import { ISlackClient } from '../interfaces/ISlackClient';
import { ITaskInput } from '../interfaces/ITaskInput';

const TYPES = {
    ITaskInput: Symbol.for('ITaskInput'),
    ISlackClient: Symbol.for('ISlackClient'),
    ISlackChatMessage: Symbol.for('ISlackChatMessage'),
    ISlackFileUpload: Symbol.for('ISlackFileUpload'),
    ISlackChannelService: Symbol.for('ISlackChannelService'),
    ILogger: Symbol.for('ILogger'),
    IMonitoring: Symbol.for('IMonitoring')
};

export default TYPES;