const request = require("supertest");
const app = require("../app"); // Asegúrate de exportar `app` desde app.js

describe("Prueba de fitness function - Alumno Login", () => {
  it("Excelente - Primer intento", async () => {
    const res = await request(app).post("/alumnos/login").send({ usuario: "test", clave: "123456" });
    expect(res.body.fitness).toBe("Excelente");
  });

  it("OK - Segundo intento", async () => {
    await request(app).post("/alumnos/login").send({ usuario: "test", clave: "123456" });
    const res = await request(app).post("/alumnos/login").send({ usuario: "test", clave: "123456" });
    expect(res.body.fitness).toBe("OK");
  });

  it("Bad - Tercer intento o más", async () => {
    await request(app).post("/alumnos/login").send({ usuario: "test", clave: "123456" });
    await request(app).post("/alumnos/login").send({ usuario: "test", clave: "123456" });
    const res = await request(app).post("/alumnos/login").send({ usuario: "test", clave: "123456" });
    expect(res.body.fitness).toBe("Bad");
  });
});
