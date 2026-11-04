const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const healthRoutes = require("./routes/health.routes");
const usersRoutes = require("./routes/users.routes");

const app = express();

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentación",
      version: "1.0.0",
      description: "Documentación de mi API en Express",
    },
    servers: [{ url: "http://localhost:3000", description: "Servidor Local" }]
  },
  apis: ["./src/routes/*.js"], // Le dice a Swagger que busque la documentación en los archivos de rutas
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Ruta donde vivirá la interfaz gráfica de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/v1/health", healthRoutes);

// Cambiamos el endpoint a "usuarios" como en la captura
app.use("/api/v1/usuarios", usersRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "NOT_FOUND", message: "Endpoint not found" });
});

module.exports = app;