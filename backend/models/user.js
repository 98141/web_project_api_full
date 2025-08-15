const mongoose = require('mongoose');
const validator = require('validator');

const urlValidator = (v) => validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Jacques Cousteau',
      trim: true,
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Explorador',
      trim: true,
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
      validate: {
        validator: urlValidator,
        message: 'El avatar debe ser una URL válida (http/https)',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Correo electrónico no válido'],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

// Índice único por si aún no existe
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
