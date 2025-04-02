const request = require("supertest");
const app = require("../index");

const nuevaCancion = {
  IdCancion: 11,
  Titulo: "Nueva Canción " + (Math.random() + 1).toString(36).substring(2),
  Duracion: "3:45",
  AlbumId: 1,
};

const cancionModificada = {
  Titulo: "Canción Modificada " + (Math.random() + 1).toString(36).substring(2),
  Duracion: "4:15",
  AlbumId: 1,
};

// GET /api/canciones - Obtener todas las canciones
describe("GET /api/canciones", () => {
  it("debería devolver todas las canciones", async () => {
    const res = await request(app).get("/api/canciones");
    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdCancion: expect.any(Number),
          Titulo: expect.any(String),
          Duracion: expect.any(String),
          AlbumId: expect.any(Number),
        }),
      ])
    );
  });
});


// GET /api/canciones/:id - Obtener una canción por ID
describe("GET /api/canciones/:id", () => {
  it("debería devolver la canción con el id especificado", async () => {
    const res = await request(app).get("/api/canciones/2");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdCancion: 2,
        Titulo: expect.any(String),
        Duracion: expect.any(String),
        AlbumId: expect.any(Number),
      })
    );
  });

  it("debería devolver 404 si la canción no existe", async () => {
    const res = await request(app).get("/api/canciones/9999");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "Canción no encontrada" });
  });
});

// POST /api/canciones - Crear una nueva canción
describe("POST /api/canciones", () => {
  it("debería crear una nueva canción y devolverla", async () => {
    const res = await request(app).post("/api/canciones").send(nuevaCancion);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdCancion: 11,
        Titulo: expect.any(String),
        Duracion: expect.any(String),
        AlbumId: expect.any(Number),
      })
    );
  });

  it("debería devolver 400 si hay un error de validación", async () => {
    const res = await request(app).post("/api/canciones").send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
});

// PUT /api/canciones/:id - Actualizar una canción existente
describe("PUT /api/canciones/:id", () => {
  it("debería actualizar la canción y devolver los datos actualizados", async () => {
    const res = await request(app).put("/api/canciones/11").send(cancionModificada);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdCancion: expect.any(Number),
        Titulo: expect.any(String),
        Duracion: expect.any(String),
        AlbumId: expect.any(Number),
      })
    );
  });

  it("debería devolver 404 si la canción a actualizar no existe", async () => {
    const res = await request(app).put("/api/canciones/9999").send(cancionModificada);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "Canción no encontrada" });
  });
});

// DELETE /api/canciones/:id - Eliminar una canción
describe("DELETE /api/canciones/:id", () => {
  it("debería eliminar la canción con el id especificado", async () => {
    const res = await request(app).delete("/api/canciones/11");
    expect(res.statusCode).toEqual(204);
  });

  it("debería devolver 404 si la canción a eliminar no existe", async () => {
    const res = await request(app).delete("/api/canciones/9999");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "Canción no encontrada" });
  });
});
