const { celebrate, Joi, Segments, errors } = require('celebrate');
const validator = require('validator');

// Validador personalizado para URLs
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const urlCustom = (value, helpers) => {
  if (!validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true })) {
    return helpers.message('URL inválida (requiere http/https)');
  }
  return value;
};

// VALIDACIONES PARA USUARIOS
const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
});

// VALIDACIONES PARA TARJETAS
const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().custom(urlCustom).required(),
  }),
});

const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUserId,
  validateUpdateUser,
  validateUpdateAvatar,
  validateCardId,
  validateCreateCard,
  celebrateErrors: errors(),
};
