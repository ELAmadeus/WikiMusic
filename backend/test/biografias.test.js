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

// GET /api/biografiasJWT - Obtener todas las biografías
describe("GET /api/biografiasJWT", () => {
  it("debería devolver todas las biografías con un token válido", async () => {
    const res = await request(app)
      .get("/api/biografiasJWT")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          Id: expect.any(Number),
          Historia: expect.any(String),
          ArtistaId: expect.any(Number),
          Wikipedia: expect.any(String),
          artista: expect.objectContaining({
            Nombre: expect.any(String),
          }),
        }),
      ])
    );
  });

  it("debería devolver 403 si el token no tiene rol admin", async () => {
    const res = await request(app)
      .get("/api/biografiasJWT")
      .set("Authorization", "Bearer token_invalido");

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});


// GET /api/biografiasJWT/:id - Obtener una biografía específica
describe("GET /api/biografiasJWT/:id", () => {
  it("debería devolver una biografía específica con un token válido y rol admin", async () => {
    const res = await request(app)
      .get("/api/biografiasJWT/1") // Cambia el ID si es necesario
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toEqual(
      expect.objectContaining({
        Id: 1, // Cambia el ID si es necesario
        Historia: expect.any(String),
        ArtistaId: expect.any(Number),
        Wikipedia: expect.any(String),
        artista: expect.objectContaining({
          Nombre: expect.any(String),
        }),
      })
    );
  });

  it("debería devolver 404 si la biografía no existe", async () => {
    const res = await request(app)
      .get("/api/biografiasJWT/9999") // Un ID que no exista
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "Biografia no encontrada" });
  });

  it("debería devolver 403 si el token no tiene rol admin", async () => {
    const res = await request(app)
      .get("/api/biografiasJWT/1")
      .set("Authorization", "Bearer token_invalido");

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});

// POST /api/biografiasJWT - Crear una nueva biografía
describe("POST /api/biografiasJWT", () => {
  it("debería crear una nueva biografía con un token válido", async () => {
    const res = await request(app)
      .post("/api/biografiasJWT")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        Id: 11,
        Historia: "Nueva Historia",
        ArtistaId: 1,
        Wikipedia: "este link no va a funcionar"
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        Historia: "Nueva Historia",
        ArtistaId: 1,
        Wikipedia: "este link no va a funcionar"
      })
    );
  });

  it("debería devolver 403 si no se incluye un token válido", async () => {
    const res = await request(app)
      .post("/api/biografiasJWT")
      .set("Authorization", `Bearer token_invalido`)
      .send({
        Historia: "Historia sin token",
        ArtistaId: 1,
        Wikipedia: "este link no va a funcionar",
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});


// PUT /api/biografiasJWT/:id - Actualizar una biografía específica
describe("PUT /api/biografiasJWT/:id", () => {
  it("debería actualizar una biografía existente con un token válido y datos correctos", async () => {
    const res = await request(app)
      .put("/api/biografiasJWT/11") // Cambia el ID si es necesario
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        Historia: "Historia actualizada",
        ArtistaId: 1, // ID válido de un artista
        Wikipedia: "https://actualizado.ejemplo.com",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        Id: 11, // Cambia el ID si es necesario
        Historia: "Historia actualizada",
        ArtistaId: 1,
        Wikipedia: "https://actualizado.ejemplo.com",
      })
    );
  });

  it("debería devolver 404 si la biografía a actualizar no existe", async () => {
    const res = await request(app)
      .put("/api/biografiasJWT/9999") // Un ID que no exista
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        Historia: "Historia no encontrada",
        ArtistaId: 1,
        Wikipedia: "https://noexiste.ejemplo.com",
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "Biografia no encontrada" });
  });

  it("debería devolver 400 si los datos enviados son inválidos", async () => {
    const res = await request(app)
      .put("/api/biografiasJWT/1") // Cambia el ID si es necesario
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        Historia: "", // Historia vacía no debería ser válida
        ArtistaId: null, // ArtistaId inválido
        Wikipedia: "no es un link válido",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error"); // Se asegura de que devuelva el mensaje de error
  });

  it("debería devolver 403 si el token no tiene rol admin", async () => {
    const res = await request(app)
      .put("/api/biografiasJWT/1")
      .set("Authorization", "Bearer token_invalido")
      .send({
        Historia: "Historia con token inválido",
        ArtistaId: 1,
        Wikipedia: "https://tokeninvalido.ejemplo.com",
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});


// DELETE /api/biografiasJWT/:id - Eliminar una biografía
describe("DELETE /api/biografiasJWT/:id", () => {
  it("debería eliminar una biografía con un token válido", async () => {
    const res = await request(app)
      .delete(`/api/biografiasJWT/11`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(204);
  });

  it("debería devolver 404 si la biografía no existe", async () => {
    const res = await request(app)
      .delete("/api/biografiasJWT/9999")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "Biografia no encontrada" });
  });
});
