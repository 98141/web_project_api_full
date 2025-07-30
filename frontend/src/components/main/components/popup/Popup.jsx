export default function Popup(props) {
  // se ha desestructurado onClose de props
  const { onClose, title, children } = props;

  // onClick={onClose} llama a onClose al hacer clic en el botón
  return (
    <div className="modal">
      <div className={`modal__content ${
          !title ? "popup__content_content_image" : ""
        }`}>
        <button
          aria-label="Close modal"
          className="modal__close"
          type="button"
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="modal__content-title">{title}</h3>
        {children}
      </div>
    </div>
  );
}
