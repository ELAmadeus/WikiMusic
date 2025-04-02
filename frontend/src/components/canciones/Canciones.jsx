import React, { useState, useEffect } from "react";
import { CancionesService } from "../../services/canciones.services";

function Canciones() {
  const tituloPagina = "Canciones";
  const [canciones, setCanciones] = useState(null);

  useEffect(() => {
    BuscarCanciones();
  }, []);

  async function BuscarCanciones() {
    let data = await CancionesService.Buscar();
    setCanciones(data);
  }

  return (
    <section className="intro">
      <div className="tabla h-100">
        <div className="mask d-flex align-items-center h-100"style={{ marginTop: "70px" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="table-responsive">
                  <div>
                    <div className="tituloPagina">{tituloPagina}</div>
                    <table className="table table-dark table-bordered mb-0">
                      <thead>
                        <tr>
                          <th style={{ width: "25%" }}>Título</th>
                          <th style={{ width: "25%" }}>Duración</th>
                          <th style={{ width: "25%" }}>Álbum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {canciones &&
                          canciones.map((cancion) => (
                            <tr key={cancion.IdCancion}>
                              <td>{cancion.Titulo}</td>
                              <td>{cancion.Duracion}</td>
                              <td>{cancion.album.Titulo}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Canciones };