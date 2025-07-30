const mongoose = require('mongoose');
const validator = require('validator');

const urlRegex = /^https?:\/\/(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorador',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: 'El avatar debe ser una URL válida',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Correo electrónico no válido'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
