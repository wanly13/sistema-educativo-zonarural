const request = require("supertest");
const app = require("../app"); // Asegúrate de exportar `app` desde app.js

describe("Prueba de fitness function - Alumno Login", () => {
  it("Retorna Excelente si es primer intento", async () => {
    const res = await request(app)
      .post("/alumnos/login")
      .send({ usuario: "test", clave: "123456" });

    expect(res.body.fitness).toBe("Excelente");
  });
});
