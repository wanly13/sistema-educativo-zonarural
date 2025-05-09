const express = require("express")
const archivos = express.Router()
const connection = require("../config/db");
const axios = require("axios");

archivos.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Archivos");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener archivos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

archivos.post("/", async (req, res) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, docente_id } = req.body;
    try {
        await connection.query(
            "INSERT INTO Archivos (nombre, descripcion, fecha_inicio, fecha_fin, docente_id) VALUES (?, ?, ?, ?, ?)",
            [nombre, descripcion, fecha_inicio, fecha_fin, docente_id]
        );
        res.status(201).json({ message: "Archivo registrado correctamente." });
    } catch (error) {
        console.error("Error en registro de Archivo:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


archivos.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, fecha_inicio, fecha_fin, docente_id } = req.body;
    try {
        const [existingCursos] = await connection.query("SELECT * FROM Archivos WHERE id = ?", [id]);
        if (existingCursos.length == 0)
            return res.status(404).json({ message: "Archivos no encontrado" });

        await connection.query(
            "UPDATE Archivos SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, docente_id = ? WHERE id = ?",
            [nombre, descripcion, fecha_inicio, fecha_fin, docente_id, id]
        );
        res.status(200).json({ message: "Archivo modificado correctamente." });
    } catch (error) {
        console.error("Error al actualizar archivos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

archivos.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [existingCursos] = await connection.query("SELECT * FROM Archivos WHERE id = ?", [id]);
        if (existingCursos.length === 0)
            return res.status(404).json({ message: "Archivos no encontrado" });

        const [result] = await connection.query("DELETE FROM Archivos WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "No se pudo eliminar el archivos" });

        res.status(200).json({ message: "Archivos eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar archivos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = entregas;