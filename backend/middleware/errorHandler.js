module.exports = (err, req, res, next) => {
  const { statusCode = 500, message = 'Ha ocurrido un error en el servidor' } = err;
  res.status(statusCode).send({ message });
  next();
};
