import React, { useState, useEffect } from "react";
import { PremiosService } from "../../services/premios.services";

function Premios() {
  const tituloPagina = "Premios";
  const [premios, setPremios] = useState(null);

  useEffect(() => {
    BuscarPremios();
  }, []);

  async function BuscarPremios() {
    let data = await PremiosService.Buscar();
    setPremios(data);
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
                          <th style={{ width: "20%" }}>Nombre</th>
                          <th style={{ width: "20%" }}>Descripción</th>
                          <th style={{ width: "20%" }}>Fecha de Entrega</th>
                          <th style={{ width: "20%" }}>Artista</th>
                        </tr>
                      </thead>
                      <tbody>
                        {premios &&
                          premios.map((premio) => (
                            <tr key={premio.IdPremio}>
                              <td>{premio.Nombre}</td>
                              <td>{premio.Descripcion}</td>
                              <td>{premio.FechaEntrega}</td>
                              <td>{premio.artista.Nombre}</td>
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

export { Premios };