import { Link, useLocation } from "react-router-dom";
import vector from "../../../images/Vector.png";
import line from "../../../images/Line.png";

function Header({ loggedIn, email, onLogout }) {
  const location = useLocation();

  return (
    <>
    <header className="header">
      <img src={vector} alt="Logo Around" className="header__vector" />

      <div className="header__auth">
        {loggedIn ? (
          <>
            <span className="header__email">{email}</span>
            <button className="header__logout" onClick={onLogout}>
              Cerrar sesión
            </button>
          </>
        ) : location.pathname === "/signin" ? (
          <Link to="/signup" className="header__link">
            Registrarse
          </Link>
        ) : (
          <Link to="/signin" className="header__link">
            Iniciar sesión
          </Link>
        )}
      </div>
      
    </header>
    <img src={line} alt="Logo Around" className="header__line" />
    </>
  );
}

export default Header;
