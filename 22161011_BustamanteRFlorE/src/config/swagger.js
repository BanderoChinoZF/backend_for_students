const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Users API",
    version: "1.0.0",
    description: "CRUD de usuarios - Backend for Students",
  },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    schemas: {
      UserInput: {
        type: "object",
        required: ["nombre", "username", "password"],
        properties: {
          nombre: { type: "string", example: "Ana Lopez" },
          username: { type: "string", example: "anal" },
          password: { type: "string", example: "abc123" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nombre: { type: "string", example: "Ana Lopez" },
          username: { type: "string", example: "anal" },
          password: { type: "string", example: "abc123" },
        },
      },
    },
  },
  paths: {
    "/api/v1/users": {
      get: {
        tags: ["Users"],
        summary: "Listar usuarios",
        responses: { 200: { description: "Lista de usuarios" } },
      },
      post: {
        tags: ["Users"],
        summary: "Crear usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/UserInput" } },
          },
        },
        responses: {
          201: { description: "Usuario creado" },
          400: { description: "Datos incompletos" },
          409: { description: "Username ya existe" },
        },
      },
    },
    "/api/v1/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Obtener usuario por id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Usuario" }, 404: { description: "No encontrado" } },
      },
      put: {
        tags: ["Users"],
        summary: "Actualizar usuario",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/UserInput" } },
          },
        },
        responses: { 200: { description: "Usuario actualizado" }, 404: { description: "No encontrado" } },
      },
      delete: {
        tags: ["Users"],
        summary: "Eliminar usuario",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Usuario eliminado" }, 404: { description: "No encontrado" } },
      },
    },
  },
};

module.exports = swaggerSpec;