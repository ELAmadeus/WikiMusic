import React from "react";
import moment from "moment";

export default function GenerosListado({
  Items,
  Modificar,
  Eliminar,
}) {
  return (
    <section className="intro">
      <div className="tabla">
        <div className="mask d-flex align-items-center h-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="tituloPagina">Generos</div>
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-dark table-bordered mb-0">
                    <thead>
                      <tr>
                        <th className="text-center">Nombre Género</th>
                        <th className="text-center">Descripción</th>
                        <th className="text-center">Popularidad</th>
                        <th className="text-center">Fecha de Creación</th>                       
                        <th className="text-center text-nowrap">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Items &&
                        Items.map((Item) => (
                          <tr key={Item.IdGenero}>
                            <td>{Item.Nombre}</td>
                            <td>{Item.Descripcion}</td>
                            <td>{Item.Popularidad}</td>                            
                            <td className="text-end">
                              {moment(Item.FechaCreacion).format("DD/MM/YYYY")}
                            </td>
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
                                onClick={() => Eliminar(Item.IdGenero)}
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