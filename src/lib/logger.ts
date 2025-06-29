// Simple logger implementation for Code Solutions Studio
export interface LogContext {
  [key: string]: any;
}

class Logger {
  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('INFO', message, context));
  }

  error(message: string, error?: any, context?: LogContext): void {
    const errorStr = error ? ` | Error: ${error.message || error}` : '';
    console.error(this.formatMessage('ERROR', message + errorStr, context));
    if (error?.stack) {
      console.error(error.stack);
    }
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('WARN', message, context));
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('DEBUG', message, context));
    }
  }

  auth(message: string, error?: any, context?: LogContext): void {
    const errorStr = error ? ` | Error: ${error.message || error}` : '';
    console.warn(this.formatMessage('AUTH', message + errorStr, context));
    if (error?.stack) {
      console.error(error.stack);
    }
  }
}

export const logger = new Logger();
export default logger;
