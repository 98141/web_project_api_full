const express = require('express');
const mongoose = require('mongoose');

const { createUser, login } = require('./controllers/usersController');
const auth = require('./middleware/auth');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(express.json());

// rutas públicas
app.post('/signup', createUser);
app.post('/signin', login);

// Middleware para proteger rutas
app.use(auth);

// rutas protegidas
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).send({ message: 'Recurso solicitado no encontrado' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
