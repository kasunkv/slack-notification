//import { SentryEvent } from '@sentry/types';

export interface IMonitoring {
    configure(): void;
    captureException(error: any): void;
    //captureEvent(event: SentryEvent): void;
    captureMessage(message: string): void;
}