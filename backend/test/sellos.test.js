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

// GET /api/sellosJWT - Obtener todos los sellos
describe("GET /api/sellosJWT", () => {
  it("debería devolver todos los sellos con un token válido", async () => {
    const res = await request(app)
      .get("/api/sellosJWT")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdSello: expect.any(Number),
          Nombre: expect.any(String),
          Pais: expect.any(String),
          FechaFundacion: expect.any(String),
          ArtistasFirmados: expect.any(Number),
        }),
      ])
    );
  });

  it("debería devolver 403 si el token no es válido", async () => {
    const res = await request(app)
      .get("/api/sellosJWT")
      .set("Authorization", "Bearer token_invalido");

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});

// GET /api/sellosJWT/:id - Obtener un sello por ID
describe("GET /api/sellosJWT/:id", () => {
  it("debería devolver el sello con el id especificado con un token válido", async () => {
    const res = await request(app)
      .get("/api/sellosJWT/2") // Cambia el ID según lo que haya en tu base de datos
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdSello: 2,
        Nombre: expect.any(String),
        Pais: expect.any(String),
        FechaFundacion: expect.any(String),
        ArtistasFirmados: expect.any(Number),
      })
    );
  });

  it("debería devolver 404 si el sello no existe", async () => {
    const res = await request(app)
      .get("/api/sellosJWT/9999") // Cambia por un ID que no exista
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "Sello no encontrado" });
  });

  it("debería devolver 403 si el token no es válido", async () => {
    const res = await request(app)
      .get("/api/sellosJWT/1")
      .set("Authorization", "Bearer token_invalido");

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});

// POST /api/sellosJWT - Crear un nuevo sello
describe("POST /api/sellosJWT", () => {
  it("debería crear un nuevo sello con un token válido", async () => {
    const nuevoSello = {
      IdSello: 11,
      Nombre: "Nuevo Sello " + (Math.random() + 1).toString(36).substring(2),
      Pais: "País de ejemplo",
      FechaFundacion: new Date(),
      ArtistasFirmados: 5,
    };

    const res = await request(app)
      .post("/api/sellosJWT")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(nuevoSello);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        Nombre: expect.any(String),
        Pais: expect.any(String),
        FechaFundacion: expect.any(String),
        ArtistasFirmados: expect.any(Number),
      })
    );
  });

  it("debería devolver 403 si no se incluye un token válido", async () => {
    const res = await request(app)
      .post("/api/sellosJWT")
      .set("Authorization", "Bearer token_invalido")
      .send({});

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});

// PUT /api/sellosJWT/:id - Actualizar un sello existente
describe("PUT /api/sellosJWT/:id", () => {
  it("debería actualizar un sello con un token válido", async () => {
    const res = await request(app)
      .put("/api/sellosJWT/11")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        Nombre: "Sello Modificado",
        Pais: "País Modificado",
        FechaFundacion: new Date(),
        ArtistasFirmados: 10,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        Nombre: expect.any(String),
        Pais: expect.any(String),
        FechaFundacion: expect.any(String),
        ArtistasFirmados: expect.any(Number),
      })
    );
  });

  it("debería devolver 404 si el sello a actualizar no existe", async () => {
    const res = await request(app)
      .put("/api/sellosJWT/9999")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        Nombre: "Sello Inexistente",
        Pais: "País Inexistente",
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "Sello no encontrado" });
  });

  it("debería devolver 403 si el token no es válido", async () => {
    const res = await request(app)
      .put("/api/sellosJWT/1")
      .set("Authorization", "Bearer token_invalido")
      .send({
        Nombre: "Sello Modificado",
        Pais: "País Modificado",
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});

// DELETE /api/sellosJWT/:id - Eliminar un sello
describe("DELETE /api/sellosJWT/:id", () => {
  it("debería eliminar un sello con un token válido", async () => {
    const res = await request(app)
      .delete("/api/sellosJWT/11")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(204);
  });

  it("debería devolver 404 si el sello no existe", async () => {
    const res = await request(app)
      .delete("/api/sellosJWT/9999")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: "Sello no encontrado" });
  });

  it("debería devolver 403 si el token no es válido", async () => {
    const res = await request(app)
      .delete("/api/sellosJWT/1")
      .set("Authorization", "Bearer token_invalido");

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({ message: "token no es valido" });
  });
});