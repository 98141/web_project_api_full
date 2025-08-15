const mongoose = require('mongoose');
const validator = require('validator');

const urlValidator = (v) => validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true });

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: urlValidator,
        message: 'El enlace debe ser una URL válida (http/https)',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
  },
  { timestamps: true },
);

// Índices útiles
cardSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Card', cardSchema);
