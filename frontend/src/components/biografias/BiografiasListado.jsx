import React from "react";

export default function BiografiasListado({
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
              <div className="tituloPagina">Biografias</div>
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-dark table-bordered mb-0">
                    <thead>
                      <tr>
                        <th className="text-center"style={{ height: "40px", width: "495px" }}>Historia</th>
                        <th className="text-center"style={{ height: "40px", width: "165px" }}>Nombre del Artista</th>
                        <th className="text-center"style={{ height: "40px", width: "350px" }}>Información Adicional</th>
                        <th className="text-center" style={{ height: "40px", width: "100px" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Items &&
                        Items.map((Item) => (
                          <tr key={Item.Id}>
                            <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{Item.Historia}</td>
                            <td>{Item.artista.Nombre}</td>
                            <td>
                              <a href={Item.Wikipedia} target="_blank" rel="noopener noreferrer">
                                {Item.Wikipedia}
                              </a>
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
                                onClick={() => Eliminar(Item.Id)}
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