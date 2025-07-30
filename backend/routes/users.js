const express = require('express');

const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/usersController');

// Obtener todos los usuarios
router.get('/', getUsers);

// Obtener información del usuario actual
router.get('/me', getCurrentUser);

// Obtener un usuario por ID
router.get('/:userId', getUserById);

// Actualizar perfil del usuario actual
router.patch('/me', updateUser);

// Actualizar avatar del usuario actual
router.patch('/me/avatar', updateAvatar);

module.exports = router;
