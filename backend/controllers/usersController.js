const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Error al obtener usuarios' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Usuario no encontrado' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'ID de usuario no válido' });
      }
      return res.status(500).send({ message: 'Error del servidor' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.status(201).send({ email: user.email, _id: user._id }))
      .catch((err) => {
        if (err.code === 11000) {
          return res.status(409).send({ message: 'Este correo ya está registrado' });
        }
        if (err.name === 'ValidationError') {
          return res.status(400).send({ message: err.message });
        }
        return res.status(500).send({ message: 'Error al crear usuario' });
      });
  });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Datos inválidos para actualización' });
      }
      return res.status(500).send({ message: 'Error al actualizar perfil' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Avatar no válido' });
      }
      return res.status(500).send({ message: 'Error al actualizar avatar' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return res.status(401).send({ message: 'Correo o contraseña incorrectos' });

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) return res.status(401).send({ message: 'Correo o contraseña incorrectos' });

          const token = jwt.sign({ _id: user._id }, 'super-secret-key', { expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch(() => res.status(500).send({ message: 'Error del servidor' }));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Error del servidor' }));
};
