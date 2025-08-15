require('dotenv').config();

const {
  PORT = 5000,
  MONGO_URI = 'mongodb://127.0.0.1:27017/aroundb',
  JWT_SECRET = 'dev-secret',
  CORS_ORIGINS = 'http://localhost:3000',
  NODE_ENV = 'development',
} = process.env;

module.exports = {
  PORT: Number(PORT),
  MONGO_URI,
  JWT_SECRET,
  CORS_ORIGINS: CORS_ORIGINS.split(',').map((s) => s.trim()),
  NODE_ENV,
};
