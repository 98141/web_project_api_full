const express = require('express');
const mongoose = require('mongoose');

const { createUser, login } = require('./controllers/usersController');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const { requestLogger, errorLogger } = require('./middleware/logger');

const {
  validateCreateUser,
  validateLogin,
} = require('./middleware/validation');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(express.json());

// Logger para solicitudes (antes de rutas)
app.use(requestLogger);

// rutas públicas con validación
app.post('/signup', validateCreateUser, createUser);
app.post('/signin', validateLogin, login);

// Middleware para proteger rutas
app.use(auth);

// rutas protegidas
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Ruta no existente
app.use((req, res) => {
  res.status(404).send({ message: 'Recurso solicitado no encontrado' });
});

// Logger para errores (antes del manejo de errores)
app.use(errorLogger);

// Middleware centralizado de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
