const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.port || 3000;

const profesores = require("./routes/profesores");
const alumnos = require("./routes/alumnos");
//const proveedores = require("./routes/proveedores");

app.use(cors());
app.use(express.json());
app.use("/profesores", profesores);
app.use("/alumnos", alumnos);
//app.use("/proveedores", proveedores);

app.listen(PORT, () => {
    console.log("Server Listening in", PORT);
});