import React, { useState, useEffect } from "react";
import { ArtistasService } from "../../services/artistas.services";

function Artistas() {
  const tituloPagina = "Artistas";
  const [artistas, setArtistas] = useState([]); // Inicializar como array vacío

  useEffect(() => {
    BuscarArtistas();
  }, []);

  async function BuscarArtistas() {
    try {
      const data = await ArtistasService.Buscar();
      setArtistas(data);
    } catch (error) {
      console.error("Error al buscar artistas:", error);
    }
  }

  return (
    <section className="intro">
      <div className="tabla h-100" style={{ marginTop: "70px" }}>
        <div className="mask d-flex align-items-center h-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="table-responsive">
                  <div>
                    <div className="tituloPagina">{tituloPagina}</div>
                    <table className="table table-dark table-bordered mb-0">
                      <thead>
                        <tr>
                          <th style={{ width: "20%" }}>Nombre</th>
                          <th style={{ width: "20%" }}>Nacionalidad</th>
                          <th style={{ width: "20%" }}>Años Activos</th>
                          <th style={{ width: "20%" }}>Fecha Inicio</th>
                          <th style={{ width: "20%" }}>Sello</th>
                        </tr>
                      </thead>
                      <tbody>
                        {artistas.length > 0 ? (
                          artistas.map((artista) => (
                            <tr key={artista.IdArtista}>
                              <td>{artista.Nombre || "Sin nombre"}</td>
                              <td>{artista.Nacionalidad || "Desconocida"}</td>
                              <td>{artista.AñosActivos || "N/A"}</td>
                              <td>{artista.FechaInicio || "N/A"}</td>
                              <td>{artista.sello?.Nombre || "Sin sello"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No hay artistas disponibles.
                            </td>
                          </tr>
                        )}
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

export { Artistas };
