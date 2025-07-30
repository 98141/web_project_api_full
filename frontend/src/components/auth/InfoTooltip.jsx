import successIcon from "../../../public/success-icon.svg"; 
import errorIcon from "../../../public/error-icon.svg";     
import closeIcon from "../../../public/close-icon.svg";     
function InfoTooltip({ success, onClose }) {
  return (
    <div className="tooltip">
      <div className={`tooltip__container ${success ? "tooltip__container--success" : "tooltip__container--error"}`}>
        <button className="tooltip__close" onClick={onClose}>
          <img src={closeIcon} alt="Cerrar" />
        </button>
        <img
          className="tooltip__icon"
          src={success ? successIcon : errorIcon}
          alt={success ? "Éxito" : "Error"}
        />
        <p className="tooltip__message">
          {success
            ? "¡Correcto! Ya estás registrado."
            : "Uy, algo salió mal. Por favor, inténtalo nuevamente."}
        </p>
      </div>
    </div>
  );
}

export default InfoTooltip;
