import * as Task from 'vsts-task-lib';
import * as path from 'path';

import container from './di/inversify.config';
import TYPES from './di/types';

import { ITaskInput } from './interfaces/ITaskInput';
import { ISlackChatMessage } from './interfaces/ISlackChatMessage';
import { ISlackFileUpload } from './interfaces/ISlackFileUpload';
import { NotificationType } from './Constants';

Task.setResourcePath(path.join(__dirname, 'task.json'));

async function run(): Promise<string> {
    const promise = new Promise<string>(async (resolve, reject) => {
        try {
            
            const taskInput = container.get<ITaskInput>(TYPES.ITaskInput);
            Task.debug(taskInput.toJSON());

            switch (taskInput.NotificationType) {

                case NotificationType.CHAT_MESSAGE:
                    const chatMessage = container.get<ISlackChatMessage>(TYPES.ISlackChatMessage);
                    await chatMessage.send();                    
                    break;

                case NotificationType.FILE_UPLOAD:
                    const fileUpload = container.get<ISlackFileUpload>(TYPES.ISlackFileUpload);
                    await fileUpload.upload();
                    break;
            
                default:
                    break;
            }

        } catch (err) {
            reject(err.message || err);
        }
    });

    return promise;
}

run()
    .then((res: string) => {
        Task.setResult(Task.TaskResult.Succeeded, res);
    })
    .catch((err: any) => {
        Task.setResult(Task.TaskResult.Failed, `Task Failed. Error: ${JSON.stringify(err)}`);
    });