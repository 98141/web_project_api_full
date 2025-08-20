# Link despliegue

<https://tripletefull.front.jumpingcrab.com/>

---

## 🌐 API Backend — Usuarios & Cards

Backend desarrollado en **Node.js + Express + MongoDB** con autenticación JWT, validaciones robustas, seguridad básica y manejo centralizado de errores.  
Incluye endpoints para gestión de **usuarios** y **tarjetas** (cards) con paginación, likes y control de permisos.

---

## 📦 Tecnologías utilizadas

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT** (autenticación con tokens)
- **bcryptjs** (hash de contraseñas)
- **celebrate/Joi** (validación de entradas)
- **helmet** (cabeceras de seguridad)
- **cors** (lista blanca de orígenes)
- **express-rate-limit** (anti fuerza bruta)
- **winston + express-winston** (logs a archivos)
- **dotenv** (variables de entorno)
- **validator** (validación de URL y email)

---

## 🗂️ Estructura del proyecto

```project/
├─ .env
├─ config.js
├─ app.js
├─ models/
│  ├─ user.js
│  └─ card.js
├─ controllers/
│  ├─ usersController.js
│  └─ cardController.js
├─ routes/
│  ├─ index.js
│  ├─ users.js
│  └─ cards.js
└─ middleware/
   ├─ auth.js
   ├─ validation.js
   ├─ errorHandler.js
   └─ logger.js
```

---

## ⚙️ Configuración

### 1️⃣ Variables de entorno (`.env`)

Ejemplo:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/aroundb
JWT_SECRET=super-secret-key-cambia-esto
CORS_ORIGINS=http://localhost:3000
NODE_ENV=development
```

- `CORS_ORIGINS`: orígenes permitidos separados por coma.
- `JWT_SECRET`: **cambiar en producción**.

### 2️⃣ Instalación de dependencias

```bash
npm install
```

---

## 🚀 Ejecución

```bash
node app.js
# o con nodemon
npx nodemon app.js
```

Servidor y conexión a MongoDB se reportan por consola.  
Los logs se guardan en la carpeta `logs/`.

---

## 🔐 Seguridad aplicada

- **CORS** con lista blanca (`CORS_ORIGINS`).
- **Helmet** para cabeceras seguras.
- **Rate limit** en `/signin` y `/signup`.
- **JWT** obligatorio en rutas protegidas (`/users/*`, `/cards/*`).
- **Contraseñas** hasheadas con `bcryptjs`.
- **Validaciones** con `celebrate/Joi` en payloads.
- **Manejo centralizado de errores**.
- **Logs** de peticiones y errores con Winston.

---

## ✅ Validaciones (Celebrate/Joi)

- **Usuarios**
  - `POST /signup`: `email`, `password` (min 6), `name` y `about` (2–30), `avatar` (URL).
  - `POST /signin`: `email`, `password`.
  - `PATCH /users/me`: `name`, `about`.
  - `PATCH /users/me/avatar`: `avatar` (URL).
- **Cards**
  - `POST /cards`: `name` (2–30), `link` (URL).
  - `/:cardId`: `cardId` hex de 24 chars.

---

## 🧑‍💼 Autenticación

- **Signup** (`/signup`) crea usuario → `{ email, _id }`.
- **Signin** (`/signin`) devuelve `{ token }`.
- Rutas protegidas requieren:  
  `Authorization: Bearer <TOKEN>`

---

## 📚 Endpoints principales

### Auth

| Método | Ruta      | Body                                                                                       | Respuesta |
|--------|----------|--------------------------------------------------------------------------------------------|-----------|
| POST   | /signup  | `{ "name": "...", "about": "...", "avatar": "https://...", "email": "...", "password": "..." }` | `201 { email, _id }` |
| POST   | /signin  | `{ "email": "...", "password": "..." }`                                                     | `200 { token }` |

### Usuarios

| Método | Ruta           | Descripción                 | Respuesta |
|--------|---------------|-----------------------------|-----------|
| GET    | /users         | Lista de usuarios           | `[ { _id, name, about, avatar, email } ]` |
| GET    | /users/me      | Usuario actual              | `{ _id, name, about, avatar, email }` |
| GET    | /users/:id     | Usuario por ID              | `{ _id, name, about, avatar, email }` |
| PATCH  | /users/me      | Actualiza `name` y `about`  | `{ _id, name, about, avatar, email }` |
| PATCH  | /users/me/avatar | Actualiza avatar          | `{ _id, name, about, avatar, email }` |

### Cards

| Método | Ruta                  | Descripción                              | Respuesta |
|--------|-----------------------|------------------------------------------|-----------|
| GET    | /cards                | Lista paginada de tarjetas               | `{ total, page, limit, items: [...] }` |
| POST   | /cards                | Crea tarjeta                             | `{ _id, name, link, owner, likes, createdAt }` |
| DELETE | /cards/:cardId        | Elimina tarjeta (solo owner)             | `{ message: "Tarjeta eliminada" }` |
| PUT    | /cards/:cardId/likes  | Da like                                  | `{ _id, name, link, owner, likes, createdAt }` |
| DELETE | /cards/:cardId/likes  | Quita like                               | `{ _id, name, link, owner, likes, createdAt }` |

---

## 🧪 Ejemplos con cURL

### Crear usuario

```bash
curl -X POST http://localhost:5000/signup   -H "Content-Type: application/json"   -d '{"name":"Juan Pérez","about":"Full Stack","avatar":"https://example.com/juan.png","email":"juan.perez@example.com","password":"MiClaveSegura123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/signin   -H "Content-Type: application/json"   -d '{"email":"juan.perez@example.com","password":"MiClaveSegura123"}'
```

### Crear tarjeta

```bash
curl -X POST http://localhost:5000/cards   -H "Authorization: Bearer <TOKEN>"   -H "Content-Type: application/json"   -d '{"name":"Un paisaje","link":"https://images.example.com/photo.jpg"}'
```

### Listar tarjetas

```bash
curl -H "Authorization: Bearer <TOKEN>"   "http://localhost:5000/cards?page=1&limit=12&sort=-createdAt"
```

### Dar like

```bash
curl -X PUT -H "Authorization: Bearer <TOKEN>" http://localhost:5000/cards/<cardId>/likes
```

### Quitar like

```bash
curl -X DELETE -H "Authorization: Bearer <TOKEN>" http://localhost:5000/cards/<cardId>/likes
```

### Eliminar tarjeta

```bash
curl -X DELETE -H "Authorization: Bearer <TOKEN>" http://localhost:5000/cards/<cardId>
```

---

## 📄 Manejo de errores

- **400**: Validación fallida (Celebrate/Mongoose).
- **401**: Token inválido o ausente.
- **403**: Acción prohibida.
- **404**: Recurso no encontrado.
- **409**: Email ya registrado.
- **500**: Error interno (mensaje genérico en producción).

---

## 🪵 Logging

- Requests y errores con **winston + express-winston** a:
  - `logs/request.log`
  - `logs/error.log`
- Formato JSON + timestamps.
- Filtrado de campos sensibles recomendado.

---

## 📈 Paginación y rendimiento

- `GET /cards` admite:
  - `page` (default 1)
  - `limit` (default 20, máx. 100)
  - `sort` (default `-createdAt`)
- Índices en `cards` (`createdAt`, `owner`) y `users` (email único).
- `populate('owner', 'name avatar _id')` en respuestas de cards.

---

## 📌 Próximos pasos sugeridos

- Tests de integración con **Jest + Supertest**.
- Roles (admin/usuario) con middleware de autorización.
- Verificación de email y recuperación de contraseña.
- Rotación de logs con `winston-daily-rotate-file`.
- Despliegue con **PM2** o Docker.

---

## 📄 Licencia

Este proyecto se distribuye bajo licencia MIT.
