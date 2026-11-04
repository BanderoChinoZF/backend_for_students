// src/config/swagger.sj

const swaggerJSDoc = require("swagger-jsdoc");
const env = require("./env");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Students Microservice API - CRUD Usuarios",
      version: "1.0.0",
      description: "Documentación interactiva de la API de gestión de usuarios usando Swagger UI.",
      contact: {
        name: "Wilver A. Flores Santiago",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: "Servidor local de desarrollo",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
              description: "Identificador único del usuario",
            },
            name: {
              type: "string",
              example: "Wilver Flores",
              description: "Nombre completo del usuario",
            },
            username: {
              type: "string",
              example: "wilver",
              description: "Nombre de usuario",
            },
            password: {
              type: "string",
              example: "password123",
              description: "Contraseña de acceso",
            },
          },
        },
        UserInput: {
          type: "object",
          required: ["name", "username", "password"],
          properties: {
            name: {
              type: "string",
              example: "Juan Pérez",
            },
            username: {
              type: "string",
              example: "jperez",
            },
            password: {
              type: "string",
              example: "miPassword123",
            },
          },
        },
        UserUpdateInput: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Juan Pérez Modificado",
            },
            username: {
              type: "string",
              example: "jperez_updated",
            },
            password: {
              type: "string",
              example: "newPassword123",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "NOT_FOUND",
            },
            message: {
              type: "string",
              example: "Usuario no encontrado",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Lee las anotaciones de Swagger en los archivos de rutas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;