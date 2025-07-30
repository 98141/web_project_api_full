export default function ImagePopup({ card, onClose }) {
  if (!card) return null;

  const { name, link } = card;

  return (
    <div className="modal popup popup__open" onClick={(e) => e.stopPropagation()}>
      <span
        className="modal__close modal__close-popup"
        id="closeButtonPopup"
        onClick={onClose}
      >
        {" "}
        ×
      </span>
      <img src={link} alt={name} className="imagen-popup" />
      <p className="popup__paragraph">{name}</p>
    </div>
  );
}
