import { pino, Logger } from 'pino';

const logger: Logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  redact: [],
});

export default logger;
