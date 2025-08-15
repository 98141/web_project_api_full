const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const e = new Error('Se requiere autorización');
    e.statusCode = 403;
    return next(e);
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { _id: ... }
  } catch (err) {
    const e = new Error('Token inválido');
    e.statusCode = 401;
    return next(e);
  }

  return next();
};
