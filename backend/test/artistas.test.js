const request = require("supertest");
const app = require("../index"); // Asegúrate de que esta sea la ruta correcta a tu archivo principal

const nuevoArtista = {
  IdArtista: 11,
  Nombre: "Nuevo Artista " + (Math.random() + 1).toString(36).substring(2),
  Nacionalidad: "Argentina",
  AñosActivos: 10,
  FechaInicio: "2005-01-01",
  SelloId: 1, // Asegúrate de que este ID de sello exista en tu base de datos
};

const artistaModificado = {
  Nombre: "Artista Modificado " + (Math.random() + 1).toString(36).substring(2),
  Nacionalidad: "Chile",
  AñosActivos: 15,
  FechaInicio: "2010-01-01",
  SelloId: 2, // Asegúrate de que este ID de sello exista en tu base de datos
};

// GET /api/artistas - Obtener todos los artistas
describe("GET /api/artistas", () => {
  it("debería devolver todos los artistas", async () => {
    const res = await request(app).get("/api/artistas");
    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdArtista: expect.any(Number),
          Nombre: expect.any(String),
          Nacionalidad: expect.any(String),
          AñosActivos: expect.any(Number),
          FechaInicio: expect.any(String),
          sello: expect.objectContaining({
            Nombre: expect.any(String),
          }),
        }),
      ])
    );
  });
});

// GET /api/artistas/:id - Obtener un artista por ID
describe("GET /api/artistas/:id", () => {
  it("debería devolver el artista con el id especificado", async () => {
    const res = await request(app).get("/api/artistas/2");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdArtista: expect.any(Number),
        Nombre: expect.any(String),
        Nacionalidad: expect.any(String),
        AñosActivos: expect.any(Number),
        FechaInicio: expect.any(String),
        SelloId: expect.any(Number),
      })
    );
  });

  it("debería devolver 404 si el artista no existe", async () => {
    const res = await request(app).get("/api/artistas/9999");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "Artista no encontrado" });
  });
});

// POST /api/artistas - Crear un nuevo artista
describe("POST /api/artistas", () => {
  it("debería crear un nuevo artista y devolverlo", async () => {
    const res = await request(app).post("/api/artistas").send(nuevoArtista);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdArtista: expect.any(Number),
        Nombre: expect.any(String),
        Nacionalidad: expect.any(String),
        AñosActivos: expect.any(Number),
        FechaInicio: expect.any(String),
        SelloId: expect.any(Number),
      })
    );
  });

  it("debería devolver 400 si hay un error de validación", async () => {
    const res = await request(app).post("/api/artistas").send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
});

// PUT /api/artistas/:id - Actualizar un artista existente
describe("PUT /api/artistas/:id", () => {
  it("debería actualizar el artista y devolver los datos actualizados", async () => {
    const res = await request(app).put("/api/artistas/11").send(artistaModificado);
    expect(res.statusCode).toEqual(204);
  });

  it("debería devolver 404 si el artista a actualizar no existe", async () => {
    const res = await request(app).put("/api/artistas/9999").send(artistaModificado);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "Artista no encontrado" });
  });
});

// DELETE /api/artistas/:id - Eliminar un artista
describe("DELETE /api/artistas/:id", () => {
  it("debería eliminar el artista con el id especificado", async () => {
    const res = await request(app).delete("/api/artistas/11");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "artista eliminado" });
  });

  it("debería devolver 404 si el artista a eliminar no existe", async () => {
    const res = await request(app).delete("/api/artistas/9999");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "artista no encontrado" });
  });
});