// controllers/cardController.js
const Card = require('../models/card');

exports.getCards = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
    const sort = req.query.sort || '-createdAt';

    const [items, total] = await Promise.all([
      Card.find({})
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('owner', 'name avatar _id')
        // Si quieres también los datos de quiénes dieron like, descomenta:
        // .populate('likes', 'name avatar _id')
        .lean(),
      Card.countDocuments({}),
    ]);

    res.send({
      total,
      page,
      limit,
      items,
    });
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;

    const card = await Card.create({ name, link, owner: req.user._id });
    // populate de owner para devolverlo listo al frontend
    await card.populate('owner', 'name avatar _id');

    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const e = new Error('Datos inválidos al crear la tarjeta');
      e.statusCode = 400;
      return next(e);
    }
    return next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) {
      const e = new Error('Tarjeta no encontrada');
      e.statusCode = 404;
      throw e;
    }

    if (String(card.owner) !== String(req.user._id)) {
      const e = new Error('No autorizado para eliminar esta tarjeta');
      e.statusCode = 403;
      throw e;
    }

    await card.deleteOne();
    res.send({ message: 'Tarjeta eliminada' });
  } catch (err) {
    if (err.name === 'CastError') {
      const e = new Error('ID de tarjeta no válido');
      e.statusCode = 400;
      return next(e);
    }
    return next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .populate('owner', 'name avatar _id')
      // .populate('likes', 'name avatar _id')
      .lean();

    if (!card) {
      const e = new Error('Tarjeta no encontrada para dar like');
      e.statusCode = 404;
      throw e;
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      const e = new Error('ID de tarjeta no válido');
      e.statusCode = 400;
      return next(e);
    }
    return next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .populate('owner', 'name avatar _id')
      // .populate('likes', 'name avatar _id')
      .lean();

    if (!card) {
      const e = new Error('Tarjeta no encontrada para quitar like');
      e.statusCode = 404;
      throw e;
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      const e = new Error('ID de tarjeta no válido');
      e.statusCode = 400;
      return next(e);
    }
    return next(err);
  }
};
