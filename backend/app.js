// app.js
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const {
  PORT, MONGO_URI, CORS_ORIGINS, NODE_ENV,
} = require('./config');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { celebrateErrors } = require('./middleware/validation');
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/auth');

const routes = require('./routes'); // index.js

const app = express();

// Seguridad básica
app.use(helmet());

// CORS (permite varias origins)
app.use(
  cors({
    origin(origin, callback) {
      // permitir herramientas como Postman (sin origin) y orígenes configurados
      if (!origin || CORS_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error('CORS no permitido para este origin'));
    },
    credentials: true,
  }),
);

app.use(express.json());

// Logger de solicitudes
app.use(requestLogger);

// Limitar fuerza bruta en signin (y opcional en signup)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/signin', authLimiter);
app.use('/signup', authLimiter);

// Conexión DB
mongoose.set('strictQuery', true);
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((e) => console.error('❌ Error conectando a MongoDB', e.message));

// Rutas públicas
app.use(routes);

app.use(auth);

app.use((req, res) => {
  res.status(404).send({ message: 'Recurso solicitado no encontrado' });
});

// Logger de errores y manejadores
app.use(errorLogger);
app.use(celebrateErrors);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT} [${NODE_ENV}]`);
});
