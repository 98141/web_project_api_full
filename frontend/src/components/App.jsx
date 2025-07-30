import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Header from "./header/header.jsx";
import Main from "./main/main.jsx";
import Footer from "./footer/footer.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import InfoTooltip from "./auth/InfoTooltip.jsx";

import * as auth from "../utils/auth.js";
import { api } from "../utils/Api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [infoTooltip, setInfoTooltip] = useState({
    isOpen: false,
    success: false,
  });

  const navigate = useNavigate();

  // Verificar token al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setLoggedIn(true);
          setCurrentUser({ email: res.data.email }); // backend devuelve solo email
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.error("Token inválido:", err);
          handleLogout();
        });
    }
  }, []);

  // Login
  function handleLogin({ email, password }) {
    auth
      .login({ email, password })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setLoggedIn(true);
        return auth.checkToken(res.token);
      })
      .then((data) => {
        setCurrentUser({ email: data.data.email });
        navigate("/", { replace: true });
      })
      .catch((err) => {
        setInfoTooltip({ isOpen: true, success: false });
        console.error("Login error:", err);
      });
  }

  // Registro
  function handleRegister({ email, password }) {
    auth
      .register({ email, password })
      .then(() => {
        setInfoTooltip({ isOpen: true, success: true });
        navigate("/signin");
      })
      .catch((err) => {
        setInfoTooltip({ isOpen: true, success: false });
        console.error("Registro fallido:", err);
      });
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setCurrentUser({});
    navigate("/signin");
  }

  // Actualizar perfil (nombre y descripción)
  const handleUpdateUser = (data) => {
    api
      .updateUserProfile(data)
      .then((newData) => {
        setCurrentUser((prev) => ({ ...prev, ...newData }));
      })
      .catch((err) => {
        console.error("Error al actualizar perfil:", err);
      });
  };

  // Actualizar avatar
  const handleUpdateAvatar = (avatarUrl) => {
    api
      .updateUserAvatar(avatarUrl)
      .then((newData) => {
        setCurrentUser((prev) => ({ ...prev, ...newData }));
      })
      .catch((err) => {
        console.error("Error al actualizar avatar:", err);
      });
  };

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, handleUpdateUser, handleUpdateAvatar }}
    >
      <div className="pages">
        <Header
          loggedIn={loggedIn}
          email={currentUser.email}
          onLogout={handleLogout}
        />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/signup"
            element={<Register onRegister={handleRegister} />}
          />
          <Route
            path="*"
            element={<Navigate to={loggedIn ? "/" : "/signin"} />}
          />
        </Routes>

        <Footer />

        {infoTooltip.isOpen && (
          <InfoTooltip
            success={infoTooltip.success}
            onClose={() =>
              setInfoTooltip((prev) => ({ ...prev, isOpen: false }))
            }
          />
        )}
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
