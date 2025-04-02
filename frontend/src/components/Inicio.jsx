import { Link } from "react-router-dom";
import React from "react";
import imagen  from "../utils/fondo1.png";

function Inicio() {
  return (
    <div className="inicio-container h-screen flex justify-between items-center px-4 text-neutral-400 m-0 gap-4">
      
      <div className="left-content flex flex-col items-start">
        <div className="centered-element max-w-2xl mx-auto p-4">
          <h1 className="inicio-container-title display-1 relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-left font-sans font-bold">
            WikiMusic
          </h1>
          <br />
          <div className="text-left mt-8">
            <Link to="/albumes">
              <button className="button-64 boton-albumes" role="button">
                <span className="text">
                  <i className="fa fa-search"></i>Ver Álbumes
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>      
      <div className="right-content flex justify-end items-center w-1/2">
        <img src={imagen} alt="Imagen" className="max-w-full h-auto" />
      </div>     
    </div>
  );
}

export { Inicio };