import * as Task from 'azure-pipelines-task-lib/task';
import * as path from 'path';

import container from './di/inversify.config';
import TYPES from './di/types';

import { ITaskInput } from './interfaces/ITaskInput';
import { ISlackChatMessage } from './interfaces/ISlackChatMessage';
import { ISlackFileUpload } from './interfaces/ISlackFileUpload';
import { ILogger } from './interfaces/ILogger';
import { IMonitoring } from './interfaces/IMonitoring';

import { NotificationType } from './Constants';

Task.setResourcePath(path.join(__dirname, 'task.json'));

async function run(): Promise<string> {
    Task.debug('Starting...');
    const monitoring = container.get<IMonitoring>(TYPES.IMonitoring);
    const promise = new Promise<string>(async (resolve, reject) => {
        try {
            Task.debug('Getting TaskInput & Logger');
            const taskInput = container.get<ITaskInput>(TYPES.ITaskInput);
            const logger = container.get<ILogger>(TYPES.ILogger);

            Task.debug('Printing contents of TaskInput');
            logger.logDebug(taskInput.toJSON());
            Task.debug('Configuring Monitoring');
            monitoring.configure();

            switch (taskInput.NotificationType) {

                case NotificationType.CHAT_MESSAGE:
                    Task.debug('Start sending ChatMessage');
                    const chatMessage = container.get<ISlackChatMessage>(TYPES.ISlackChatMessage);
                    const chatResult: string = await chatMessage.send();
                    resolve(chatResult);
                    break;

                case NotificationType.FILE_UPLOAD:
                    Task.debug('Start UploadFile');
                    const fileUpload = container.get<ISlackFileUpload>(TYPES.ISlackFileUpload);
                    const uploadResult: string = await fileUpload.upload();
                    resolve(uploadResult);
                    break;

                default:
                    break;
            }

        } catch (err) {
            Task.debug(`Failed: ${err}`);
            monitoring.captureException(err);
            reject(err.message || err);
        }
    });

    return promise;
}

run()
    .then((res: string) => {
        console.log(res);
        Task.setResult(Task.TaskResult.Succeeded, res);
    })
    .catch((err: any) => {
        const msg = `Task Failed. Error: ${JSON.stringify(err)}`;
        console.log(msg);
        Task.setResult(Task.TaskResult.Failed, msg);
    });