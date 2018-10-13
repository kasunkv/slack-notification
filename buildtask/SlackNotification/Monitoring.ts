import * as sentry from '@sentry/node';
import { inject, injectable } from 'inversify';

import TYPES from './di/types';

import { IMonitoring } from './interfaces/IMonitoring';
import { SentryEvent } from '@sentry/node';
import { ILogger } from './interfaces/ILogger';

@injectable()
export class Monitoring implements IMonitoring {
    private _logger: ILogger;

    constructor(@inject(TYPES.ILogger) logger: ILogger) {
        this._logger = logger;
    }

    configure(): void {
        this._logger.logDebug('[Monitoring.configure()] Configure called');
        sentry.init({
            dsn: 'SENTRY_DSN',
            release: 'TASK_RELEASE_VERSION'
        });
    }

    captureException(error: any): void {
        this._logger.logDebug(`[Monitoring.captureException()] CaptureException called. Error=${error.message || error}`);
        sentry.captureException(error);
    }

    captureEvent(event: SentryEvent): void {
        sentry.captureEvent(event);
    }

    captureMessage(message: string): void {
        sentry.captureMessage(message);
    }
}