import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AuthService from "../services/auth.services";

function Menu() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(
    AuthService.getUsuarioLogueado()
  );

  function CambioUsuarioLogueado(_usuarioLogueado) {
    setUsuarioLogueado(_usuarioLogueado);
  }

  useEffect(() => {
    AuthService.subscribeUsuarioLogueado(CambioUsuarioLogueado);
    return () => {
      AuthService.subscribeUsuarioLogueado(null);
    };
  }, []);

  return (
    <header>
    <nav className="navbar sticky-top bg-nav navbar-expand-md"
    style={{ marginLeft: '100px' }}>
      <div className="container-fluid navbar-dark">
        <a className="navbar-brand" href="#!">
          <i className="fa fa-dumbbell"></i>
          <i> Música</i>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/inicio">
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/albumes">
                Álbumes
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/artistas">
                Artistas
              </NavLink>
              </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/canciones">
                Canciones
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/premios">
                Premios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/conciertos">
                Conciertos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/generos">
                Géneros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/biografias">
                Biografías
              </NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink
                className="nav-link"
                title="Exclusivo para musicos"
                to="/sellos"
              >
                Sellos
              </NavLink>
            </li>

          </ul>
          <ul className="navbar-nav2 ms-auto">
            {usuarioLogueado && (
              <li className="nav-item">
                <a className="nav-link" href="#!">
                  Bienvenido {usuarioLogueado}
                </a>
              </li>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/login/Inicio">
                <span
                  className={usuarioLogueado ? "text-warning" : "text-success"}
                >
                  <i
                    className={
                      usuarioLogueado ? "fa-solid fa-right-from-bracket" : "fa-solid fa-user"
                    }
                  ></i>
                </span>
                {usuarioLogueado ? " Cerrar Sesión" : " Iniciar Sesión"}
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
    </nav>
    </header>
  );
}
export { Menu };
