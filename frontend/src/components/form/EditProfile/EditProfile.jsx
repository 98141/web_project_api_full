import { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";

export default function EditProfile({ onClose }) {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Cuando currentUser cambie (por ejemplo, al cargar desde la API), actualizamos los campos
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setDescription(currentUser.about || "");
    }
  }, [currentUser]);

  const handleNameChange = (e) => setName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleUpdateUser) {
      handleUpdateUser({ name, about: description });
    }
    onClose();
  };

  return (
    <form name="formEditProfile" noValidate onSubmit={handleSubmit}>
      <input
        className="modal__content-input form__input"
        type="text"
        id="nameImg"
        placeholder="Nombre de Usuario"
        minLength="2"
        maxLength="30"
        name="userName"
        required
        value={name}
        onChange={handleNameChange}
      />
      <span id="nameImg-error" className="form__input-error"></span>

      <input
        className="modal__content-input form__input"
        type="text"
        id="linkImg"
        placeholder="Acerca de mí"
        name="userDescription"
        required
        value={description}
        onChange={handleDescriptionChange}
      />
      <span id="linkImg-error" className="form__input-error"></span>

      <div className="modal__actions">
        <button
          id="saveButtonImg"
          className="form__submit"
          type="submit"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
