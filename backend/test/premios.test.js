const request = require("supertest");
const app = require("../index"); // Asegúrate de que esta sea la ruta correcta a tu archivo principal


const nuevoPremio = {
  IdPremio: 11,
  Nombre: "Nuevo Premio " + (Math.random() + 1).toString(36).substring(2),
  Descripcion: "Descripción del nuevo premio",
  FechaEntrega: new Date(),
  ArtistaId: 1,
};

const premioModificado = {
  Nombre: "Premio Modificado " + (Math.random() + 1).toString(36).substring(2),
  Descripcion: "Descripción del premio Modificado",
  FechaEntrega: new Date(),
  ArtistaId: 2,
};


// GET /api/premios - Obtener todos los premios
describe("GET /api/premios", () => {
  it("debería devolver todos los premios", async () => {
    const res = await request(app).get("/api/premios");
    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdPremio: expect.any(Number),
          Nombre: expect.any(String),
          Descripcion: expect.any(String),
          FechaEntrega: expect.any(String),
          ArtistaId: expect.any(Number),
        }),
      ])
    );
  });
});

// GET /api/premios/:id - Obtener un concierto por ID
describe("GET /api/premios/:id", () => {
  it("debería devolver el premio con el id especificado", async () => {
    const res = await request(app).get("/api/premios/2");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdPremio: expect.any(Number),
        Nombre: expect.any(String),
        Descripcion: expect.any(String),
        FechaEntrega: expect.any(String),
        ArtistaId: expect.any(Number),
      })
    );
  });

  it("debería devolver 404 si el concierto no existe", async () => {
    const res = await request(app).get("/api/premios/9999");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "Premio no encontrado" });
  });
});


// POST /api/premios - Crear un nuevo premio
describe("POST /api/premios", () => {
  it("debería crear un nuevo premio y devolverlo", async () => {
    const res = await request(app).post("/api/premios").send(nuevoPremio);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdPremio: 11,
        Nombre: expect.any(String),
        Descripcion: expect.any(String),
        FechaEntrega: expect.any(String),
        ArtistaId: expect.any(Number),
      })
    );
  });

  it("debería devolver 400 si hay un error de validación", async () => {
    const res = await request(app).post("/api/premios").send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
});

// PUT /api/premios/:id - Actualizar un premio existente
describe("PUT /api/premios/:id", () => {
  it("debería actualizar el premio y devolver los datos actualizados", async () => {
    const res = await request(app).put("/api/premios/11").send(premioModificado);
    expect(res.statusCode).toEqual(200); // Cambiado de 200 a 204
    expect(res.body).toEqual(
      expect.objectContaining({
        Nombre: expect.any(String),
        Descripcion: expect.any(String),
        FechaEntrega: expect.any(String),
        ArtistaId: expect.any(Number),
    })
   ); // No se espera un cuerpo de respuesta
  });

  it("debería devolver 404 si el concierto a actualizar no existe", async () => {
    const res = await request(app).put("/api/premios/9999").send(premioModificado);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "Premio no encontrado" });
  });
});


// DELETE /api/premios/:id - Eliminar un premio
describe("DELETE /api/premios/:id", () => {
  it("debería eliminar el premio con el id especificado", async () => {
    const res = await request(app).delete("/api/premios/11"); // Cambia el ID según lo que haya en tu base de datos
    expect(res.statusCode).toEqual(204);
  });

  it("debería devolver 404 si el premio a eliminar no existe", async () => {
    const res = await request(app).delete("/api/premios/9999"); // Cambia por un ID que no exista
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "Premio no encontrado" });
  });
});
