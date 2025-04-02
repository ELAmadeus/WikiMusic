import React, { useState, useEffect } from "react";
import { AlbumesService } from "../../services/albumes.services";

function Albumes() {
  const tituloPagina = "Albumes";
  const [albumes, setAlbumes] = useState(null);

  useEffect(() => {
    BuscarAlbumes();
  }, []);

  async function BuscarAlbumes() {
    let data = await AlbumesService.Buscar();
    setAlbumes(data);
  }

  return (
    <section className="intro">
      <div className="tabla h-100"style={{ marginTop: "70px" }}>
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
                          <th style={{ width: "16.6%" }}>Título</th>
                          <th style={{ width: "16.6%" }}>Artista</th>
                          <th style={{ width: "16.6%" }}>Género</th>
                          <th style={{ width: "16.6%" }}>Fecha de Lanzamiento</th>
                          <th style={{ width: "16.6%" }}>Cantidad de Canciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {albumes &&
                          albumes.map((album) => (
                            <tr key={album.IdAlbum}>
                              <td>{album.Titulo}</td>
                              <td>{album.artista ? album.artista.Nombre : "Desconocido"}</td>
                              <td>{album.genero ? album.genero.Nombre : "Desconocido"}</td>
                              <td>{album.FechaLanzamiento}</td>
                              <td>{album.CantidadCanciones}</td>
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

export { Albumes };