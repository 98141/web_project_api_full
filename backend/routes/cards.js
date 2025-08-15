const express = require('express');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cardController');

const {
  validateCreateCard,
  validateCardId,
} = require('../middleware/validation');

const router = express.Router();

// Todas estas rutas deben estar protegidas por tu middleware auth a nivel app o index router
router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
