const express = require("express")
const temas = express.Router()
const connection = require("../config/db");
const axios = require("axios");

temas.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Temas");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener temas:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

temas.post("/", async (req, res) => {
    const { nombre, descripcion, curso_id } = req.body;
    try {
        await connection.query(
            "INSERT INTO Temas (nombre, descripcion, curso_id) VALUES (?, ?, ?, ?, ?)",
            [nombre, descripcion, curso_id]
        );
        res.status(201).json({ message: "Curso registrado correctamente." });
    } catch (error) {
        console.error("Error en registro de curso:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


temas.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, curso_id } = req.body;
    try {
        const [existingCursos] = await connection.query("SELECT * FROM Temas WHERE id = ?", [id]);
        if (existingCursos.length == 0)
            return res.status(404).json({ message: "Temas no encontrado" });

        await connection.query(
            "UPDATE Temas SET nombre = ?, descripcion = ?, curso_id = ? WHERE id = ?",
            [nombre, descripcion, curso_id, id]
        );
        res.status(200).json({ message: "Curso modificado correctamente." });
    } catch (error) {
        console.error("Error al actualizar tema:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

temas.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [existingCursos] = await connection.query("SELECT * FROM Temas WHERE id = ?", [id]);
        if (existingCursos.length === 0)
            return res.status(404).json({ message: "Temas no encontrado" });

        const [result] = await connection.query("DELETE FROM Temas WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "No se pudo eliminar el tema" });

        res.status(200).json({ message: "Temas eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar tema:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = entregas;