// src/app.js

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const env = require("./config/env");
const healthRoutes = require("./routes/health.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentación - Backend for Students",
      version: "1.0.0",
      description: "Documentación de mi API en Express",
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: "Servidor Local",
      },
    ],
  },
  // Rutas de Swagger
  apis: [
    path.join(__dirname, "routes", "*.js").split(path.sep).join("/"),
    path.join(__dirname, "app.js").split(path.sep).join("/"),
    path.join(__dirname, "server.js").split(path.sep).join("/"),
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
// Montar la interfaz de Swagger en /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas de la API
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/users", userRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "Endpoint not found",
  });
});

module.exports = app;