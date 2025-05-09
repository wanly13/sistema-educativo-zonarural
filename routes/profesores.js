const express = require("express")
const clientes = express.Router()
const connection = require("../config/db");
const { encriptar } = require("../auth/bcrypt")

clientes.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Profesores");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener Profesores:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

clientes.post("/login", async (req, res) => {
    const { usuario } = req.body;
    try {
        const [clientes] = await connection.query("SELECT * FROM Profesores");
        const validation = clientes.filter(user => user.usuario === usuario);
        if (validation.length === 0)
            res.status(401).json({ message: "Usuario no registrado" })
        else
            res.status(200).json({ message: "Login correcto" });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

clientes.post("/register", async (req, res) => {
    const { nombre, usuario, clave, email } = req.body;
    try {
        const hash_clave = encriptar(clave);
        const [existingclientes] = await connection.query("SELECT * FROM Profesores WHERE usuario = ?", [usuario]);
        if (existingclientes.length > 0)
            return res.status(409).json({ message: "Usuario ya registrado" });
        await connection.query("INSERT INTO Profesores (nombre, usuario, clave, email) VALUES (?, ?, ?, ?)", [nombre, usuario, hash_clave, email]);
        res.status(201).json({ message: "Cliente registrado correctamente." });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

clientes.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [clientes] = await connection.query("SELECT * FROM Profesores");
        const user = clientes.filter(user => id == user.id);
        if (user.length === 0)
            res.status(401).json({ message: "ID no registrado" })
        else{
            const [result] = await connection.query("DELETE FROM Profesores WHERE id = ?", [user[0].id]);
            if (result.affectedRows === 0) 
                return res.status(404).json({ message: "Cliente no encontrado" });
            res.status(200).json({ message: "Cliente eliminado correctamente" });
        }
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = clientes;