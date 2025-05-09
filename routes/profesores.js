const express = require("express")
const profesores = express.Router()
const connection = require("../config/db");
const { encriptar } = require("../auth/bcrypt")


function getFitnessSecurity(n) {
    if (n === 1) return "Excelente";
    if (n === 2) return "Bueno";
    return "Malo";
}


profesores.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Profesores");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener Profesores:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});
// Security - Fitnes Function 
profesores.post("/login", async (req, res) => {
    const { usuario, clave } = req.body;

    try {
        const [results] = await connection.query("SELECT * FROM Profesores WHERE usuario = ?", [usuario]);

        if (results.length === 0) {
            return res.status(401).json({ message: "Usuario no registrado" });
        }

        const user = results[0];
        const clave_correcta = await bcrypt.compare(clave, user.clave);
        if (clave_correcta) {
            const nuevosIntentos = user.cantidad_logeos + 1;
            await connection.query("UPDATE Profesores SET cantidad_logeos = ? WHERE id = ?", [nuevosIntentos, user.id]);

            return res.status(401).json({
                message: "Clave incorrecta",
                attempts: nuevosIntentos,
                fitness: getFitnessSecurity(nuevosIntentos)
            });
        }

        await connection.query("UPDATE Profesores SET cantidad_logeos = 0 WHERE id = ?", [user.id]);

        return res.status(200).json({
            message: "Login correcto",
            attempts: user.cantidad_logeos + 1,
            fitness: getFitnessSecurity(user.cantidad_logeos + 1)
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


profesores.post("/register", async (req, res) => {
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

profesores.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [profesores] = await connection.query("SELECT * FROM Profesores");
        const user = profesores.filter(user => id == user.id);
        if (user.length === 0)
            res.status(401).json({ message: "ID no registrado" })
        else {
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

module.exports = profesores;