const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const err = new Error('Usuario no encontrado');
      err.statusCode = 404;
      throw err;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        const customError = new Error('ID de usuario no válido');
        customError.statusCode = 400;
        return next(customError);
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({ email: user.email, _id: user._id }))
    .catch((err) => {
      if (err.code === 11000) {
        const duplicateError = new Error('Este correo ya está registrado');
        duplicateError.statusCode = 409;
        return next(duplicateError);
      }
      if (err.name === 'ValidationError') {
        const validationError = new Error(err.message);
        validationError.statusCode = 400;
        return next(validationError);
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const validationError = new Error('Datos inválidos para actualización');
        validationError.statusCode = 400;
        return next(validationError);
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const validationError = new Error('Avatar no válido');
        validationError.statusCode = 400;
        return next(validationError);
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const authError = new Error('Correo o contraseña incorrectos');
        authError.statusCode = 401;
        throw authError;
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const authError = new Error('Correo o contraseña incorrectos');
            authError.statusCode = 401;
            throw authError;
          }

          const token = jwt.sign({ _id: user._id }, 'super-secret-key', { expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};
