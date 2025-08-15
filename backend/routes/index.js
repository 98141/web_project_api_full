// routes/index.js
const express = require('express');
const { login, createUser } = require('../controllers/usersController');
const { validateCreateUser, validateLogin } = require('../middleware/validation');
const auth = require('../middleware/auth');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

const router = express.Router();

// Rutas públicas
router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);

// Rutas protegidas
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;
