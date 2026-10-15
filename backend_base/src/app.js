const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const healthRoutes = require("./routes/health.routes");
const usuariosRoutes = require("./routes/usuarios.routes");

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is running",
  });
});

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/usuarios", usuariosRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "Endpoint not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "Ocurrió un error interno del servidor",
  });
});

module.exports = app;
