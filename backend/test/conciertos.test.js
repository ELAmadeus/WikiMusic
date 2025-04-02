const request = require("supertest");
const app = require("../index");

let accessToken;

beforeAll(async () => {
  // Realizamos login para obtener el token
  const res = await request(app).post("/api/login").send({
    usuario: "musico",
    clave: "123",
  });

  accessToken = res.body.accessToken;

  if (!accessToken) {
    throw new Error("No se pudo obtener el token de autenticación");
  }
});

// GET /api/conciertosJWT - Obtener todos los conciertos
describe("GET /api/conciertosJWT", () => {
  it("debería devolver todos los conciertos con un token válido", async () => {
    const res = await request(app)
      .get("/api/conciertosJWT")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdConcierto: expect.any(Number),
          Nombre: expect.any(String),
          Fecha: expect.any(String),
          Lugar: expect.any(String),
          ArtistaId: expect.any(Number),
          DuracionMinutos: expect.any(Number),
          artista: expect.objectContaining({
            Nombre: expect.any(String),
          }),
        }),
      ])
    );
  });

  it("debería devolver 403 si el token no tiene rol admin", async () => {
    const res = await request(app)
      .get("/api/conciertosJWT")
      .set("Authorization", "Bearer token_invalido");

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});

// GET /api/conciertosJWT/:id - Obtener un concierto específico
describe("GET /api/conciertosJWT/:id", () => {
  it("debería devolver un concierto específico con un token válido y rol admin", async () => {
    const res = await request(app)
      .get("/api/conciertosJWT/1") // Cambia el ID si es necesario
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toEqual(
      expect.objectContaining({
        IdConcierto: expect.any(Number),
        Nombre: expect.any(String),
        Fecha: expect.any(String),
        Lugar: expect.any(String),
        ArtistaId: expect.any(Number),
        DuracionMinutos: expect.any(Number),
        artista: expect.objectContaining({
          Nombre: expect.any(String),
        }),
      })
    );
  });

  it("debería devolver 404 si el concierto no existe", async () => {
    const res = await request(app)
      .get("/api/conciertosJWT/9999") // Un ID que no exista
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "Concierto no encontrado" });
  });

  it("debería devolver 403 si el token no tiene rol admin", async () => {
    const res = await request(app)
      .get("/api/conciertosJWT/1")
      .set("Authorization", "Bearer token_invalido");

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});

// POST /api/conciertosJWT - Crear un nuevo concierto
describe("POST /api/conciertosJWT", () => {
  it("debería crear un nuevo concierto con un token válido", async () => {
    const res = await request(app)
      .post("/api/conciertosJWT")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        IdConcierto: 11,
        Nombre: "Nuevo Concierto",
        Fecha: "2023-12-31",
        Lugar: "Nuevo Lugar",
        ArtistaId: 1,
        DuracionMinutos: 120
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        Nombre: "Nuevo Concierto",
        Fecha: "2023-12-31",
        Lugar: "Nuevo Lugar",
        ArtistaId: 1,
        DuracionMinutos: 120
      })
    );
  });

  it("debería devolver 403 si no se incluye un token válido", async () => {
    const res = await request(app)
      .post("/api/conciertosJWT")
      .set("Authorization", `Bearer token_invalido`)
      .send({
        Nombre: "Nuevo Concierto",
        Fecha: "2023-12-31",
        Lugar: "Nuevo Lugar",
        ArtistaId: 1,
        DuracionMinutos: 120
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});

// PUT /api/conciertosJWT/:id - Actualizar un concierto específico
describe("PUT /api/conciertosJWT/:id", () => {
  it("debería actualizar un concierto existente con un token válido y datos correctos", async () => {
    const res = await request(app)
      .put("/api/conciertosJWT/11") // Cambia el ID si es necesario
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        Nombre: "Concierto actualizado",
        Fecha: "2023-12-31",
        Lugar: "Lugar actualizado",
        ArtistaId: 1,
        DuracionMinutos: 120
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdConcierto: 11, // Cambia el ID si es necesario
        Nombre: "Concierto actualizado",
        Fecha: "2023-12-31",
        Lugar: "Lugar actualizado",
        ArtistaId: 1,
        DuracionMinutos: 120
      })
    );
  });

  it("debería devolver 404 si el concierto a actualizar no existe", async () => {
    const res = await request(app)
      .put("/api/conciertosJWT/9999") // Un ID que no exista
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        Nombre: "Concierto no encontrado",
        Fecha: "2023-12-31",
        Lugar: "Lugar no encontrado",
        ArtistaId: 1,
        DuracionMinutos: 120
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "Concierto no encontrado" });
  });

  it("debería devolver 400 si los datos enviados son inválidos", async () => {
    const res = await request(app)
      .put("/api/conciertosJWT/1") // Cambia el ID si es necesario
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        Nombre: "",
        Fecha: "",
        Lugar: "",
        ArtistaId: null,
        DuracionMinutos: -1
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error"); // Se asegura de que devuelva el mensaje de error
  });

  it("debería devolver 403 si el token no tiene rol admin", async () => {
    const res = await request(app)
      .put("/api/conciertosJWT/1")
      .set("Authorization", "Bearer token_invalido")
      .send({
        Nombre: "Concierto con token inválido",
        Fecha: "2023-12-31",
        Lugar: "Lugar con token inválido",
        ArtistaId: 1,
        DuracionMinutos: 120
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});

// DELETE /api/conciertosJWT/:id - Eliminar un concierto
describe("DELETE /api/conciertosJWT/:id", () => {
  it("debería eliminar un concierto con un token válido", async () => {
    const res = await request(app)
      .delete(`/api/conciertosJWT/11`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(204);
  });

  it("debería devolver 404 si el concierto no existe", async () => {
    const res = await request(app)
      .delete("/api/conciertosJWT/9999")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "Concierto no encontrado" });
  });
});