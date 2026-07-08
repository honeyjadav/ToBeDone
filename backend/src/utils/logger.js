import fs from 'fs';
import path from 'path';

const logsDir = './logs';

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const logger = {
  info: (message) => {
    const log = `[${getTimestamp()}] INFO: ${message}`;
    console.log(log);
    fs.appendFileSync(path.join(logsDir, 'info.log'), log + '\n');
  },
  error: (message) => {
    const log = `[${getTimestamp()}] ERROR: ${message}`;
    console.error(log);
    fs.appendFileSync(path.join(logsDir, 'error.log'), log + '\n');
  },
  warn: (message) => {
    const log = `[${getTimestamp()}] WARN: ${message}`;
    console.warn(log);
    fs.appendFileSync(path.join(logsDir, 'warn.log'), log + '\n');
  },
  debug: (message) => {
    const log = `[${getTimestamp()}] DEBUG: ${message}`;
    console.debug(log);
    fs.appendFileSync(path.join(logsDir, 'debug.log'), log + '\n');
  },
};

export default logger;