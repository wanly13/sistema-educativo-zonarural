const request = require("supertest");
const app = require("../app"); // Asegúrate de exportar `app` desde app.js

describe("Prueba de fitness function - Búsqueda Cursos por tiempo de consulta", () => {
  it("Debe ser 'Excelente' si tarda 2ms o menos", async () => {
    const res = await request(app).post("/cursos/busqueda").send({
      nombre: 'Curso1',
      descripcion: null,
      fecha_inicio: null,
      fecha_fin: null,
      docente_id: null
    });

    expect(res.body.elapsed).toBeLessThanOrEqual(2);
    expect(res.body.fitness).toBe("Excelente");
  });

  it("Debe ser 'OK' si tarda hasta 100ms", async () => {
    const res = await request(app).post("/cursos/busqueda").send({
      nombre: 'Curso1',
      descripcion: null,
      fecha_inicio: null,
      fecha_fin: null,
      docente_id: null
    });

    expect(res.body.elapsed).toBeLessThanOrEqual(100);
    expect(res.body.fitness).toBe("OK");
  });

  it("Debe ser 'Bad' si tarda 600ms o más", async () => {
    // Simulacion de la lentidud
    const slowQuery = jest.spyOn(connection, 'query').mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return [[]];
    });

    const res = await request(app).post("/cursos/busqueda").send({
      nombre: 'Curso1',
      descripcion: null,
      fecha_inicio: null,
      fecha_fin: null,
      docente_id: null
    });

    expect(res.body.elapsed).toBeGreaterThanOrEqual(600);
    expect(res.body.fitness).toBe("Bad");

    slowQuery.mockRestore(); // Limpieza
  });
});
