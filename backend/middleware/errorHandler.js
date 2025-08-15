const { NODE_ENV } = process.env;

module.exports = (err, req, res, _next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message:
      // eslint-disable-next-line no-nested-ternary
      statusCode === 500
        ? (NODE_ENV === 'production'
          ? 'Ha ocurrido un error en el servidor'
          : message)
        : message,
  });
};
