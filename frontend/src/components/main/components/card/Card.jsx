import { useState } from "react";
import ImagePopup from "../popup/imagePopup/ImagePopup";

export default function Card(props) {
  const { card, onCardLike, onCardDelete } = props;
  const { name, link, isLiked } = card;

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  
  const cardLikeButtonClassName = `element__item-heart ${
    isLiked ? "element__item-heart_active" : ""
  }`;

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleLikeClick = () => {
    onCardLike(card);
  };

  const handleDeleteClick = () => {
    onCardDelete(card);
  };

  return (
    <div>
      <li className="element">
        <button
          aria-label="Delete card"
          className="element__delete"
          type="button"
          onClick={handleDeleteClick}
        >
          🗑️
        </button>
        <img
          className="element__img"
          src={link}
          alt={name}
          onClick={handleOpenPopup}
        />
        <div className="element__item">
          <h2 className="element__item-title">{name}</h2>
          <button
            aria-label="Like card"
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          />
        </div>
      </li>

      {isPopupOpen && (
        <ImagePopup card={{ name, link }} onClose={handleClosePopup} />
      )}
    </div>
  );
}