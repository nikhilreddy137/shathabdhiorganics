// Logger utility for conditional logging
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  }
};
