import * as Task from 'azure-pipelines-task-lib/task';
import { injectable } from 'inversify';

import { ILogger } from './interfaces/ILogger';

@injectable()
export class Logger implements ILogger {
    logDebug(message: string): void {
        Task.debug(message);
    }

    logConsole(message: string): void {
        console.log(message);
    }

    logWarning(message: string): void {
        Task.warning(message);
    }

    logError(message: string): void {
        Task.error(message);
    }
}