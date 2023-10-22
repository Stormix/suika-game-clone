type LogLevelType = 'debug' | 'error' | 'info' | 'log' | 'warn';

export class Logger {
  log(level: LogLevelType, ...args: unknown[]): void {
    console[level](`%c BALLS:`, 'color: #499ceb', ...args, '|', new Date().toUTCString());
  }

  info(...args: unknown[]): void {
    this.log('info', ...args);
  }
  debug(...args: unknown[]): void {
    this.log('debug', ...args);
  }
  warn(...args: unknown[]): void {
    this.log('warn', ...args);
  }
  error(...args: unknown[]): void {
    this.log('error', ...args);
  }
}

export default new Logger();
