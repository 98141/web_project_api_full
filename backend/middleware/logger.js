const { transports, format } = require('winston');
const expressWinston = require('express-winston');

// Logger para solicitudes
const requestLogger = expressWinston.logger({
  transports: [
    new transports.File({ filename: 'logs/request.log' }),
  ],
  format: format.combine(format.timestamp(), format.json()),
  requestWhitelist: ['method', 'url', 'headers', 'query', 'body'],
  dynamicMeta: (req) => {
    const meta = {};
    if (req.body && req.body.password) {
      meta.body = { ...req.body, password: '***' }; // oculta password
    }
    return meta;
  },
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
