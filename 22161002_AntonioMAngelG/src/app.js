
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const healthRoutes = require("./routes/health.routes");
const usersRoutes = require("./routes/users.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger"); 

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
app.use("/api/v1/users", usersRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "Endpoint not found",
  });
});

// Middleware de errores: atrapa cualquier error (por ejemplo, si falla la base de datos)
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "Ocurrió un error en el servidor",
  });
});

module.exports = app;