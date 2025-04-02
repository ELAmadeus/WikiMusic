import React from "react";
import moment from "moment";

export default function SellosListado({
   Items,
   Modificar,
   Eliminar
}) {
  return (
    <section className="intro">
      <div className="tabla">
        <div className="mask d-flex align-items-center h-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="tituloPagina">Sellos</div>
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-dark table-bordered mb-0">
                    <thead>
                      <tr>
                        <th className="text-center">Nombre</th>
                        <th className="text-center">País</th>
                        <th className="text-center">Fecha de Fundación</th>
                        <th className="text-center">Artistas Firmados</th>
                        <th className="text-center text-nowrap">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Items &&
                        Items.map((Item) => (
                          <tr key={Item.IdSello}>
                            <td>{Item.Nombre}</td>
                            <td>{Item.Pais}</td>
                            <td className="text-end">
                              {moment(Item.FechaFundacion).format("DD/MM/YYYY")}
                            </td>
                            <td>{Item.ArtistasFirmados}</td>
                            <td className="text-center text-nowrap">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                title="Modificar"
                                onClick={() => Modificar(Item)}
                              >
                                <span role="img" aria-label="pencil">✏️</span>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Eliminar"
                                onClick={() => Eliminar(Item.IdSello)}
                              >
                                <span role="img" aria-label="cross">❌</span>
                              </button>
                            </td>
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
    </section>
  );
}
