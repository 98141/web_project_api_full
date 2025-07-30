# Tripleten web_project_around_auth

Este proyecto es una aplicación construida en React que simula una red social para compartir lugares alrededor de Estados Unidos. El objetivo principal de esta versión es integrar el **registro, login, autenticación mediante JWT** y protección de rutas para controlar el acceso a la funcionalidad principal.

---

## 🚀 Características implementadas

### 🔐 Autenticación y autorización (JWT)

- Registro de usuarios (`/signup`)
- Inicio de sesión de usuarios (`/signin`)
- Verificación automática de token al cargar la aplicación
- Almacenamiento seguro del token en `localStorage`
- Redirección automática si el token no es válido
- Logout con limpieza del token

### 🔒 Rutas protegidas

- Solo los usuarios autenticados pueden acceder a `/` (ruta principal)
- Las rutas `/signin` y `/signup` son solo para usuarios no logueados
- Componente `ProtectedRoute` implementado para controlar acceso

### 🧑‍💻 Contexto global con React Context API

- Contexto `CurrentUserContext` que contiene:
  - `currentUser` (datos del usuario autenticado)
  - `handleUpdateUser()` para editar perfil (nombre y descripción)
  - `handleUpdateAvatar()` para actualizar avatar

---

## 🧩 Estructura del proyecto
