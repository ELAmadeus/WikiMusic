const request = require("supertest");
const app = require("../index");

const usuarioAdmin = { usuario: "musico", clave: "123" };
const usuarioMiembro = { usuario: "invitado", clave: "123" };
let refreshToken;

describe("POST /api/login", function () {
  it("Devolvería error de autenticación por clave incorrecta", async function () {
    const res = await request(app)
      .post("/api/login")
      .send({ usuario: "musico", clave: "incorrecta" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("usuario or clave incorrecto");
  });

  it("Devolvería el token para usuario admin", async function () {
    const res = await request(app).post("/api/login").send(usuarioAdmin);

    expect(res.statusCode).toEqual(200);
    expect(res.body.accessToken).toEqual(expect.any(String));
    expect(res.body.refreshToken).toEqual(expect.any(String));
    refreshToken = res.body.refreshToken; // Guardamos el refresh token para los siguientes tests
  });

  it("Devolvería el token para usuario miembro", async function () {
    const res = await request(app).post("/api/login").send(usuarioMiembro);

    expect(res.statusCode).toEqual(200);
    expect(res.body.accessToken).toEqual(expect.any(String));
    expect(res.body.refreshToken).toEqual(expect.any(String));
  });
});

describe("POST /api/token", function () {
  it("Devolvería un nuevo accessToken usando un refreshToken válido", async function () {
    const res = await request(app)
      .post("/api/token")
      .send({ refreshToken });

    expect(res.statusCode).toEqual(200);
    expect(res.body.accessToken).toEqual(expect.any(String));
  });

  it("Devolvería 401 si no se proporciona refreshToken", async function () {
    const res = await request(app).post("/api/token").send({});

    expect(res.statusCode).toEqual(401);
  });

  it("Devolvería 403 si el refreshToken es inválido", async function () {
    const res = await request(app)
      .post("/api/token")
      .send({ refreshToken: "token_invalido" });

    expect(res.statusCode).toEqual(403);
  });
});

describe("POST /api/logout", function () {
  it("Devolvería un mensaje confirmando el logout con un refreshToken válido", async function () {
    const res = await request(app)
      .post("/api/logout")
      .send({ token: refreshToken });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Usuario deslogueado!");
  });

  it("Devolvería un mensaje indicando que el token no era válido", async function () {
    const res = await request(app)
      .post("/api/logout")
      .send({ token: "token_invalido" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Logout inválido!");
  });
});
