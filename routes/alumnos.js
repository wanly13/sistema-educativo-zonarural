const express = require("express")
const alumnos = express.Router()
const connection = require("../config/db");
const { encriptar } = require("../auth/bcrypt")

alumnos.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Alumnos");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener alumnos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

alumnos.post("/login", async (req, res) => {
    const { usuario } = req.body;
    try {
        const [alumnos] = await connection.query("SELECT * FROM Alumnos");
        const validation = alumnos.filter(user => user.usuario === usuario );
        if (validation.length === 0)
            res.status(401).json({ message: "Usuario no registrado" })
        else
            res.status(200).json({ message: "Login correcto" });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

alumnos.post("/register", async (req, res) => {
    const { nombre, usuario, clave, email } = req.body;
    try {
        const hash_clave = encriptar(clave);
        const [existingEmpleados] = await connection.query("SELECT * FROM Alumnos WHERE usuario = ?", [usuario]);
        if (existingEmpleados.length > 0)
            return res.status(409).json({ message: "Usuario ya registrado" });
        await connection.query("INSERT INTO Alumnos (nombre, usuario, clave, email) VALUES (?, ?, ?, ?)", [nombre, usuario, hash_clave, email]);
        res.status(201).json({ message: "Alumno registrado correctamente." });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

alumnos.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [alumnos] = await connection.query("SELECT * FROM Alumnos");
        const user = alumnos.filter(user => id == user.id);
        if (user.length === 0)
            res.status(401).json({ message: "ID no registrado" })
        else {
            const [result] = await connection.query("DELETE FROM Alumnos WHERE id = ?", [user[0].id]);
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Alumno no encontrado" });
            res.status(200).json({ message: "Alumno eliminado correctamente" });
        }
    } catch (error) {
        console.error("Error al eliminar :", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = alumnos;