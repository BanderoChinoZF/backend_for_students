// src/app.js

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const env = require("./config/env");

// Archivos de rutas para los endpoints de la API
const healthRoutes = require("./routes/health.routes"); // Estado del servidor
const userJsonRoutes = require("./routes/user.routes"); //Rutas del JSON
const userDbRoutes = require("./routes/user.db.routes") //Rutas de Supabase

// Nuevas rutas de PostgreSQL Local:
const userRoutes = require("./routes/usuarios.routes");
const userV2Routes = require("./routes/usuarios.v2.routes");
const rolesRoutes = require("./routes/roles.routes");
const employeeRoutes = require("./routes/employee.routes");

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
      description: "Documentación de API RESTful en Express (JSON, Supabase y PostgreSQL Local con Roles y Empleados)",
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

// Rutas y endpoints de la API
app.use("/api/v1/health", healthRoutes); //verificacion de que el servidor funciona
app.use("/api/v1/users", userJsonRoutes);        // CRUD con archivo users.json
app.use("/api/v1/db/users", userDbRoutes);   // CRUD con Supabase (PostgreSQL)

//Nuevos endponts con PostgreSQL Local
app.use("/api/v1/usuarios", userRoutes);
app.use("/api/v2/usuarios", userV2Routes);
app.use("/api/v2/roles", rolesRoutes);
app.use("/api/v2/employees", employeeRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "Endpoint not found",
  });
});

module.exports = app;