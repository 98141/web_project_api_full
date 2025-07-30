import { useState, useContext } from "react";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";

export default function EditAvatar({ onClose }) {
  const userContext = useContext(CurrentUserContext); // Obtiene el objeto currentUser

  const { currentUser, handleUpdateAvatar } = userContext;

  const [avatar, setAvatar] = useState(currentUser?.avatar || ''); // Agrega la variable de estado para name

  const handleAvatarChange = (event) => {
    setAvatar(event.target.value); // Actualiza el avatar cuando cambie la entrada
  };

  function handleSubmit(e) {
    e.preventDefault();

    handleUpdateAvatar(avatar);
    onClose(); // Cierra el popup
  }

  return (
    <form name="formImg" noValidate onSubmit={handleSubmit}>
      <input
        className="modal__content-input form__input"
        type="url"
        id="nameImg"
        placeholder="URL de la imagen"
        minLength="2"
        maxLength="100"
        name="name"
        required
        onChange={handleAvatarChange} // Agrega el controlador onChange
      />
      <span id="nameImg-error" className="form__input-error"></span>

      <div className="modal__actions">
        <button
          id="saveButtonImg"
          className="form__submit button_inactive"
          type="submit"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
