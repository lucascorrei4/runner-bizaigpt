// utils/logger.ts
/**
 * Simple logger utility that prefixes logs with timestamps and log level.
 */
export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG'
}

function formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
}

export function logInfo(message: string): void {
    console.log(formatMessage(LogLevel.INFO, message));
}

export function logWarn(message: string): void {
    console.warn(formatMessage(LogLevel.WARN, message));
}

export function logError(message: string): void {
    console.error(formatMessage(LogLevel.ERROR, message));
}

export function logDebug(message: string): void {
    if (process.env.DEBUG === 'true') {
        console.debug(formatMessage(LogLevel.DEBUG, message));
    }
}
