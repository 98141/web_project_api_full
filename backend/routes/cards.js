const express = require('express');

const router = express.Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cardController');

// Obtener todas las tarjetas
router.get('/', getCards);

// Crear una nueva tarjeta
router.post('/', createCard);

// Eliminar una tarjeta por ID
router.delete('/:cardId', deleteCard);

// Dar like a una tarjeta
router.put('/:cardId/likes', likeCard);

// Quitar like a una tarjeta
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
