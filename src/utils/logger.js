const LOG_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success'
};

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  _formatMessage(message, data = null) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      message,
      data
    };
  }

  _log(level, message, data = null) {
    const logEntry = this._formatMessage(message, data);
    
    if (this.isDevelopment) {
      switch (level) {
        case LOG_LEVELS.INFO:
          console.log('%c[INFO]', 'color: #0088ff', logEntry);
          break;
        case LOG_LEVELS.WARNING:
          console.warn('%c[WARNING]', 'color: #ffaa00', logEntry);
          break;
        case LOG_LEVELS.ERROR:
          console.error('%c[ERROR]', 'color: #ff0000', logEntry);
          break;
        case LOG_LEVELS.SUCCESS:
          console.log('%c[SUCCESS]', 'color: #00cc00', logEntry);
          break;
        default:
          console.log(logEntry);
      }
    }

    // You can add additional logging services here (e.g., send to logging service)
    this._saveToLocalStorage(level, logEntry);
  }

  _saveToLocalStorage(level, logEntry) {
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push({ level, ...logEntry });
      // Keep only last 100 logs
      if (logs.length > 100) logs.shift();
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving log to localStorage:', error);
    }
  }

  info(message, data = null) {
    this._log(LOG_LEVELS.INFO, message, data);
  }

  warning(message, data = null) {
    this._log(LOG_LEVELS.WARNING, message, data);
  }

  error(message, data = null) {
    this._log(LOG_LEVELS.ERROR, message, data);
  }

  success(message, data = null) {
    this._log(LOG_LEVELS.SUCCESS, message, data);
  }

  getLogs() {
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch (error) {
      console.error('Error reading logs:', error);
      return [];
    }
  }

  clearLogs() {
    localStorage.removeItem('app_logs');
  }
}

export default new Logger(); 