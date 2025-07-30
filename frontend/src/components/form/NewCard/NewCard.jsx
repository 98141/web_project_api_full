import { useState } from "react";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";

export default function NewCard({ onAddCard, onClose }) {

const [name, setName] = useState("");
const [link, setLink] = useState("");

  function handleSubmit (event)  {
    event.preventDefault();
    onAddCard({ name, link }); // Formato esperado por la API
    onClose();
  };


  return (
    <form name="formImg" noValidate onSubmit={handleSubmit}>
      <input
        className="modal__content-input form__input"
        type="text"
        id="nameImg"
        placeholder="Nombre de la Imagen"
        minLength="2"
        maxLength="30"
        name="name"
        onChange={(e) => setName(e.target.value)}
        required
      />
      <span id="nameImg-error" className="form__input-error"></span>

      <input
        className="modal__content-input form__input"
        type="url"
        id="linkImg"
        placeholder="Link de la URL"
        name="link"
        onChange={(e) => setLink(e.target.value)}
        required
      />
      <span id="linkImg-error" className="form__input-error"></span>

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
