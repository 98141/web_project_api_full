const express = require('express');

const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/usersController');

// Obtener todos los usuarios
router.get('/', getUsers);

// Obtener un usuario por ID
router.get('/:userId', getUserById);

// Crear nuevo usuario
router.post('/', createUser);

// Actualizar perfil
router.patch('/me', updateUser);

// Actualizar avatar
router.patch('/me/avatar', updateAvatar);

module.exports = router;
