const { createLogger, transports, format } = require('winston');
const expressWinston = require('express-winston');

// Logger para solicitudes
const requestLogger = expressWinston.logger({
  transports: [
    new transports.File({
      filename: 'logs/request.log',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
});

// Logger para errores
const errorLogger = expressWinston.errorLogger({
  transports: [
    new transports.File({
      filename: 'logs/error.log',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
});

module.exports = {
  requestLogger,
  errorLogger,
};
