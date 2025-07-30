const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const validationError = new Error('Datos inválidos al crear la tarjeta');
        validationError.statusCode = 400;
        return next(validationError);
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      const notFoundError = new Error('Tarjeta no encontrada');
      notFoundError.statusCode = 404;
      throw notFoundError;
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        const forbiddenError = new Error('No autorizado para eliminar esta tarjeta');
        forbiddenError.statusCode = 403;
        throw forbiddenError;
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: 'Tarjeta eliminada' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const castError = new Error('ID de tarjeta no válido');
        castError.statusCode = 400;
        return next(castError);
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const notFoundError = new Error('Tarjeta no encontrada para dar like');
      notFoundError.statusCode = 404;
      throw notFoundError;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        const castError = new Error('ID de tarjeta no válido');
        castError.statusCode = 400;
        return next(castError);
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const notFoundError = new Error('Tarjeta no encontrada para quitar like');
      notFoundError.statusCode = 404;
      throw notFoundError;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        const castError = new Error('ID de tarjeta no válido');
        castError.statusCode = 400;
        return next(castError);
      }
      return next(err);
    });
};
