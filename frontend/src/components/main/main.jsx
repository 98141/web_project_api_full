import Avatar from "../../../images/Avatar.png";
import { useState, useEffect, useContext } from "react";

import NewCard from "../form/NewCard/NewCard";
import EditProfile from "../form/EditProfile/EditProfile";
import EditAvatar from "../form/EditAvatar/EditAvatar";

import Card from "./components/card/Card";
import Popup from "./components/popup/Popup";
import { api } from "../../utils/Api";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

function Main() {
  const [popup, setPopup] = useState(null);
  const [cards, setCards] = useState([]);

  // Obtener el usuario actual del contexto
  const { currentUser } = useContext(CurrentUserContext);

  //funccion para obtener las tarjetas iniciales
  useEffect(() => {
    api
      .getInitialCards()
      .then((data) => {
        setCards(data); // para que data funcione, debe ser un array de objetos
      })
      .catch((err) => {
        console.error("Error al obtener las tarjetas:", err);
      });
  }, []);

  async function handleCardLike(card) {
    const isLiked = card.isLiked;
    try {
      const newCard = await api.toggleLike(card._id, isLiked);
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  }

  async function handleCardDelete(card) {
    try {
      await api.removeCard(card._id);
      setCards((state) => state.filter((c) => c._id !== card._id));
    } catch (error) {
      console.error("Error al eliminar tarjeta:", error);
    }
  }

  async function handleNewCard(data) {
    try {
      const newCard = await api.addNewCard(data);
      setCards([newCard, ...cards]); // Agrega la nueva tarjeta al inicio
      setPopup(null); // Cierra el popup
    } catch (error) {
      console.error("Error al agregar la nueva tarjeta:", error);
    }
  }

  //funcion para abrir el popup
  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  //forma para crear el componente popup para new card
  const newCardPopup = {
    title: "Nuevo lugar",
    children: <NewCard onAddCard={handleNewCard} onClose={handleClosePopup} />,
  };
  const editProfile = { title: "Editar Perfil", children: <EditProfile onClose={handleClosePopup} />    };
  const editAvatar = {
    title: "Cambiar foto de perfil",
    children: <EditAvatar onClose={handleClosePopup}/>,
  };

  return (
    <main className="main">
      <section className="profile">
        <div className="profile__avatarr">
          <img
            src={
              currentUser.avatar && currentUser.avatar.startsWith("http")
                ? currentUser.avatar
                : Avatar
            }
            alt="Avatar"
            className="profile__avatar"
          />
          <button
            className="profile__edit-avatar"
            aria-label="Editar Avatar"
            id="editAvatarButton"
            onClick={() => handleOpenPopup(editAvatar)}
          >
            <img
              src="../images/edit_avatar.png"
              alt="Botón para editar Avatar"
            />
          </button>
        </div>
        <div className="profile__info">
          <div className="profile__info-item">
            <h1 id="profile__info-name" className="profile__info-name">
              {currentUser.name}
            </h1>
            <a href="#" onClick={() => handleOpenPopup(editProfile)}>
              <img
                src="../images/EditButton.png"
                alt="Imagen de un botón de editar"
                className="profile__info-button"
              />
            </a>
          </div>
          <h2 className="profile__info-function">{currentUser.about}</h2>
        </div>
        <button
          id="profile__button"
          className="profile__button"
          onClick={() => handleOpenPopup(newCardPopup)}
        >
          +
        </button>
      </section>

      <section id="elements" className="elements">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
        ))}
      </section>

      {popup && (
        <Popup onClose={handleClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}

export default Main;
