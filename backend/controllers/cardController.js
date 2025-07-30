const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Error al obtener tarjetas' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Datos inválidos al crear la tarjeta' });
      }
      return res.status(500).send({ message: 'Error al crear tarjeta' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Tarjeta no encontrada' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'ID de tarjeta no válido' });
      }
      return res.status(500).send({ message: 'Error al eliminar tarjeta' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Tarjeta no encontrada para dar like' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'ID de tarjeta no válido' });
      }
      return res.status(500).send({ message: 'Error al dar like' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Tarjeta no encontrada para quitar like' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'ID de tarjeta no válido' });
      }
      return res.status(500).send({ message: 'Error al quitar like' });
    });
};
