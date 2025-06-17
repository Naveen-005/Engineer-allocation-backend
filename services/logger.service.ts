import winston, { createLogger, format, transports } from 'winston';

export class LoggerService {
  private readonly winstonLogger: winston.Logger;
  private context: string;
  private static instance: LoggerService;

  constructor(context: string) {
    this.winstonLogger = LoggerService.createWinstonLogger();
    this.context = context;
  }

  public static getInstance(context: string): LoggerService {
    LoggerService.instance = new LoggerService(context);
    return LoggerService.instance;
  }

  private static createWinstonLogger() {
    const logFormat = format.printf(
      (info) => `${info.level}: [${info.timestamp}] ${info.message}`,
    );
    return createLogger({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        logFormat
      ),
      transports: [new transports.Console()],
      exitOnError: false,
    });
  }

  private createLog(level: string, message: string) {
    const msg = typeof message === 'object'
      ? JSON.stringify(message, null, 2)
      : message;
    this.winstonLogger.log(level, `[${this.context}] ${msg}`);
  }

  debug(message: any): void {
    this.createLog('debug', message);
  }

  info(message: any): void {
    this.createLog('info', message);
  }

  error(message: any): void {
    this.createLog('error', message);
  }

  warn(message: any): void {
    this.createLog('warn', message);
  }
}
