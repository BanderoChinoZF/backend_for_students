const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const healthRoutes = require("./routes/health.routes");
const diccionarioRoutes = require("./routes/diccionarioRoutes");

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
      title: "API Documentación - Diccionario",
      version: "1.0.0",
      description: "Documentación de mi API Express",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Ruta principal de prueba
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is running",
  });
});

// Rutas de la app
app.use("/api/v1/health", healthRoutes);
app.use("/api/diccionario", diccionarioRoutes);

// Manejo de rutas 404
app.use((req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "Endpoint not found",
  });
});

module.exports = app;