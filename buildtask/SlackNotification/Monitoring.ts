import * as sentry from '@sentry/node';
import { inject, injectable } from 'inversify';


import { IMonitoring } from './interfaces/IMonitoring';
import { SentryEvent } from '@sentry/node';

@injectable()
export class Monitoring implements IMonitoring {
    configure(): void {
        sentry.init({
            dsn: 'SENTRY_DSN',
            release: 'TASK_RELEASE_VERSION'
        });
    }

    captureException(error: any): void {
        sentry.captureException(error);
    }

    captureEvent(event: SentryEvent): void {
        sentry.captureEvent(event);
    }

    captureMessage(message: string): void {
        sentry.captureMessage(message);
    }
}