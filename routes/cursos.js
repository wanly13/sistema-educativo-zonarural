const express = require("express")
const cursos = express.Router()
const connection = require("../config/db");
const axios = require("axios");

cursos.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Cursos");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener cursos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

function fitnessFunctionPerformance(n) {
    if (n <= 2) return "Excelente";
    if (n <= 100) return "OK";
    if (n >= 600) return "Bad";
    return "Regular";
}

cursos.post("/busqueda", async (req, res) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, docente_id } = req.body;
    try {
        const start = Date.now(); // Inicio de medición

        let query = "SELECT * FROM Cursos WHERE 1=1";
        const params = [];

        if (nombre) query += " AND nombre LIKE ?", params.push(`%${nombre}%`);
        if (descripcion) query += " AND descripcion LIKE ?", params.push(`%${descripcion}%`);
        if (fecha_inicio) query += " AND fecha_inicio >= ?", params.push(fecha_inicio);
        if (fecha_fin) query += " AND fecha_fin <= ?", params.push(fecha_fin);
        if (docente_id) query += " AND docente_id = ?", params.push(docente_id);

        const [results] = await connection.query(query, params);
        const elapsed = Date.now() - start; // Tiempo total en ms
        const fitness = fitnessFunctionPerformance(elapsed);

        res.status(200).json({ results, elapsed, fitness });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});


cursos.post("/", async (req, res) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, docente_id } = req.body;
    try {
        await connection.query(
            "INSERT INTO Cursos (nombre, descripcion, fecha_inicio, fecha_fin, docente_id) VALUES (?, ?, ?, ?, ?)",
            [nombre, descripcion, fecha_inicio, fecha_fin, docente_id]
        );
        res.status(201).json({ message: "Curso registrado correctamente." });
    } catch (error) {
        console.error("Error en registro de curso:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


cursos.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, fecha_inicio, fecha_fin, docente_id } = req.body;
    try {
        const [existingCursos] = await connection.query("SELECT * FROM Cursos WHERE id = ?", [id]);
        if (existingCursos.length == 0)
            return res.status(404).json({ message: "Cursos no encontrado" });

        await connection.query(
            "UPDATE Cursos SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, docente_id = ? WHERE id = ?",
            [nombre, descripcion, fecha_inicio, fecha_fin, docente_id, id]
        );
        res.status(200).json({ message: "Curso modificado correctamente." });
    } catch (error) {
        console.error("Error al actualizar cursos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

cursos.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [existingCursos] = await connection.query("SELECT * FROM Cursos WHERE id = ?", [id]);
        if (existingCursos.length === 0)
            return res.status(404).json({ message: "Cursos no encontrado" });

        const [result] = await connection.query("DELETE FROM Cursos WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "No se pudo eliminar el cursos" });

        res.status(200).json({ message: "Cursos eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar cursos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = entregas;