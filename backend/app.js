const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware de autorización temporal
app.use((req, res, next) => {
  req.user = {
    _id: '686e6cca16b259a492481e4f',
  };
  next();
});

// Rutas
app.use(express.json());
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Ruta no existente
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso solicitado no encontrado' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
