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

// GET /api/generosJWT - Obtener todos los géneros
describe("GET /api/generosJWT", () => {
  it("debería devolver todos los géneros con un token válido", async () => {
    const res = await request(app)
      .get("/api/generosJWT")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdGenero: expect.any(Number),
          Nombre: expect.any(String),
          Descripcion: expect.any(String),
          Popularidad: expect.any(Number),
          FechaCreacion: expect.any(String),
        }),
      ])
    );
  });

  it("debería devolver 403 si el token no tiene rol admin", async () => {
    const res = await request(app)
      .get("/api/generosJWT")
      .set("Authorization", "Bearer token_invalido");

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});

// GET /api/generosJWT/:id - Obtener un género específico
describe("GET /api/generosJWT/:id", () => {
  it("debería devolver un género específico con un token válido y rol admin", async () => {
    const res = await request(app)
      .get("/api/generosJWT/1") // Cambia el ID si es necesario
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toEqual(
      expect.objectContaining({
        IdGenero: 1, // Cambia el ID si es necesario
        Nombre: expect.any(String),
        Descripcion: expect.any(String),
        Popularidad: expect.any(Number),
        FechaCreacion: expect.any(String),
      })
    );
  });

  it("debería devolver 404 si el género no existe", async () => {
    const res = await request(app)
      .get("/api/generosJWT/9999") // Un ID que no exista
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "Género no encontrado" });
  });

  it("debería devolver 403 si el token no tiene rol admin", async () => {
    const res = await request(app)
      .get("/api/generosJWT/1")
      .set("Authorization", "Bearer token_invalido");

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});

// POST /api/generosJWT - Crear un nuevo género
describe("POST /api/generosJWT", () => {
  it("debería crear un nuevo género con un token válido", async () => {
    const res = await request(app)
      .post("/api/generosJWT")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        IdGenero: 11,
        Nombre: "Nuevo Género",
        Descripcion: "Descripción del nuevo género",
        Popularidad: 5,
        FechaCreacion: "2023-10-01"
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        Nombre: "Nuevo Género",
        Descripcion: "Descripción del nuevo género",
        Popularidad: 5,
        FechaCreacion: "2023-10-01"
      })
    );
  });

  it("debería devolver 403 si no se incluye un token válido", async () => {
    const res = await request(app)
      .post("/api/generosJWT")
      .set("Authorization", `Bearer token_invalido`)
      .send({
        Nombre: "Género sin token",
        Descripcion: "Descripción sin token",
        Popularidad: 3,
        FechaCreacion: "2023-10-01"
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});

// PUT /api/generosJWT/:id - Actualizar un género específico
describe("PUT /api/generosJWT/:id", () => {
  it("debería actualizar un género existente con un token válido y datos correctos", async () => {
    const res = await request(app)
      .put("/api/generosJWT/11") // Cambia el ID si es necesario
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        Nombre: "Género actualizado",
        Descripcion: "Descripción actualizada",
        Popularidad: 4,
        FechaCreacion: "2023-10-02"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdGenero: 11, // Cambia el ID si es necesario
        Nombre: "Género actualizado",
        Descripcion: "Descripción actualizada",
        Popularidad: 4,
        FechaCreacion: "2023-10-02"
      })
    );
  });

  it("debería devolver 404 si el género a actualizar no existe", async () => {
    const res = await request(app)
      .put("/api/generosJWT/9999") // Un ID que no exista
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        Nombre: "Género no encontrado",
        Descripcion: "Descripción no encontrada",
        Popularidad: 1,
        FechaCreacion: "2023-10-01"
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "Género no encontrado" });
  });

  it("debería devolver 400 si los datos enviados son inválidos", async () => {
    const res = await request(app)
      .put("/api/generosJWT/1") // Cambia el ID si es necesario
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        Nombre: "", // Nombre vacío no debería ser válido
        Descripcion: null, // Descripción inválida
        Popularidad: "no es un número", // Popularidad inválida
        FechaCreacion: "fecha inválida" // Fecha inválida
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error"); // Se asegura de que devuelva el mensaje de error
  });

  it("debería devolver 403 si el token no tiene rol admin", async () => {
    const res = await request(app)
      .put("/api/generosJWT/1")
      .set("Authorization", "Bearer token_invalido")
      .send({
        Nombre: "Género con token inválido",
        Descripcion: "Descripción con token inválido",
        Popularidad: 2,
        FechaCreacion: "2023-10-01"
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});

// DELETE /api/generosJWT/:id - Eliminar un género
describe("DELETE /api/generosJWT/:id", () => {
  it("debería eliminar un género con un token válido", async () => {
    const res = await request(app)
      .delete(`/api/generosJWT/11`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(204);
  });

  it("debería devolver 404 si el género no existe", async () => {
    const res = await request(app)
      .delete("/api/generosJWT/9999")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "Género no encontrado" });
  });
});