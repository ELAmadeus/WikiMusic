const request = require("supertest");
const app = require("../index");

const nuevoAlbum = {
  IdAlbum: 11,
  Titulo: "Nuevo Album " + (Math.random() + 1).toString(36).substring(2),
  ArtistaId: 1,
  GeneroId: 1,
  FechaLanzamiento: "2023-10-10",
  CantidadCanciones: 12,
};

const albumModificado = {
  Titulo: "Album Modificado " + (Math.random() + 1).toString(36).substring(2),
  ArtistaId: 1,
  GeneroId: 1,
  FechaLanzamiento: "2023-11-10",
  CantidadCanciones: 15,
};

// GET /api/albumes - Obtener todos los álbumes
describe("GET /api/albumes", () => {
  it("debería devolver todos los álbumes", async () => {
    const res = await request(app).get("/api/albumes");
    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdAlbum: expect.any(Number),
          Titulo: expect.any(String),
          ArtistaId: expect.any(Number),
          GeneroId: expect.any(Number),
          FechaLanzamiento: expect.any(String),
          CantidadCanciones: expect.any(Number),
        }),
      ])
    );
  });
});

// GET /api/albumes/:id - Obtener un álbum por ID
describe("GET /api/albumes/:id", () => {
  it("debería devolver el álbum con el id especificado", async () => {
    const res = await request(app).get("/api/albumes/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdAlbum: 1,
        Titulo: expect.any(String),
        ArtistaId: expect.any(Number),
        GeneroId: expect.any(Number),
        FechaLanzamiento: expect.any(String),
        CantidadCanciones: expect.any(Number),
      })
    );
  });

  it("debería devolver 404 si el álbum no existe", async () => {
    const res = await request(app).get("/api/albumes/9999");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "Album no encontrado" });
  });
});

// POST /api/albumes - Crear un nuevo álbumm
describe("POST /api/albumes", () => {
  it("debería crear un nuevo álbum y devolverlo", async () => {
    const res = await request(app).post("/api/albumes").send(nuevoAlbum);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdAlbum: 11,
        Titulo: expect.any(String),
        ArtistaId: expect.any(Number),
        GeneroId: expect.any(Number),
        FechaLanzamiento: expect.any(String),
        CantidadCanciones: expect.any(Number),
      })
    );
  });

  it("debería devolver 400 si hay un error de validación", async () => {
    const res = await request(app).post("/api/albumes").send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
});

// PUT /api/albumes/:id - Actualizar un álbum existente
describe("PUT /api/albumes/:id", () => {
  it("debería actualizar el álbum y devolver los datos actualizados", async () => {
    const res = await request(app).put("/api/albumes/11").send(albumModificado);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        Titulo: expect.any(String),
        ArtistaId: expect.any(Number),
        GeneroId: expect.any(Number),
        FechaLanzamiento: expect.any(String),
        CantidadCanciones: expect.any(Number),
      })
    );
  });

  it("debería devolver 404 si el álbum a actualizar no existe", async () => {
    const res = await request(app).put("/api/albumes/9999").send(albumModificado);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "Álbum no encontrado" });
  });
});

// DELETE /api/albumes/:id - Eliminar un artista
describe("DELETE /api/albumes/:id", () => {
  it("debería eliminar el album con el id especificado", async () => {
    const res = await request(app).delete("/api/albumes/11");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "album eliminado" });
  });

  it("debería devolver 404 si el album a eliminar no existe", async () => {
    const res = await request(app).delete("/api/albumes/9999");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "album no encontrado" });
  });
});