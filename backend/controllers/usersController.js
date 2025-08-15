// controllers/usersController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');

const SALT_ROUNDS = 10;

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.send(users);
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      const e = new Error('Usuario no encontrado');
      e.statusCode = 404;
      throw e;
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      const e = new Error('ID de usuario no válido');
      e.statusCode = 400;
      return next(e);
    }
    return next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });

    return res.status(201).send({ email: user.email, _id: user._id });
  } catch (err) {
    if (err.code === 11000) {
      const e = new Error('Este correo ya está registrado');
      e.statusCode = 409;
      return next(e);
    }
    if (err.name === 'ValidationError') {
      const e = new Error(err.message);
      e.statusCode = 400;
      return next(e);
    }
    return next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true, select: '-password' },
    );

    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const e = new Error('Datos inválidos para actualización');
      e.statusCode = 400;
      return next(e);
    }
    return next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true, select: '-password' },
    );

    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const e = new Error('Avatar no válido');
      e.statusCode = 400;
      return next(e);
    }
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar con +password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const e = new Error('Correo o contraseña incorrectos');
      e.statusCode = 401;
      throw e;
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      const e = new Error('Correo o contraseña incorrectos');
      e.statusCode = 401;
      throw e;
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.send({ token });
  } catch (err) {
    return next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const me = await User.findById(req.user._id).select('-password');
    res.send(me);
  } catch (err) {
    next(err);
  }
};
