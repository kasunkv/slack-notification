export interface ILogger {
    logDebug(message: string): void;
    logConsole(message: string): void;
    logWarning(message: string): void;
    logError(message: string): void;
}