
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const usuariosRoutes = require("./routes/usuarios.routes");

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API de Usuarios - 22161048 Diaz Uriel",
    version: "1.0.0",
    endpoints: {
      usuarios: "/api/v1/usuarios"
    }
  });
});

app.use("/api/v1/usuarios", usuariosRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "Endpoint not found",
  });
});

module.exports = app;
