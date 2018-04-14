import { ISlackFileUpload } from '../interfaces/ISlackFileUpload';
import { ISlackChatMessage } from '../interfaces/ISlackChatMessage';
import { ISlackClient } from '../interfaces/ISlackClient';
import { ITaskInput } from '../interfaces/ITaskInput';

const TYPES = {
    ITaskInput: Symbol('ITaskInput'),
    ISlackClient: Symbol('ISlackClient'),
    ISlackChatMessage: Symbol('ISlackChatMessage'),
    ISlackFileUpload: Symbol('ISlackFileUpload')
};

export default TYPES;