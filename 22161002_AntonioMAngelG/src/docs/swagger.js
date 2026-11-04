// Documentación de la API en formato OpenAPI 3.0
// Swagger UI lee este objeto para generar la página interactiva en /api-docs

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "API de Usuarios - 22161002_AntonioMAngelG",
    version: "1.0.0",
    description: "CRUD de usuarios con NodeJS + Express usando un archivo JSON como base de datos",
  },
  servers: [{ url: "http://localhost:3000", description: "Servidor local" }],
  tags: [
    { name: "Health", description: "Estado del microservicio" },
    { name: "Users", description: "CRUD de usuarios" },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Angel Gabriel Antonio Mendez" },
          username: { type: "string", example: "angelg" },
          password: { type: "string", example: "angel123" },
        },
      },
      UserInput: {
        type: "object",
        required: ["name", "username", "password"],
        properties: {
          name: { type: "string", example: "Juan Perez" },
          username: { type: "string", example: "juanp" },
          password: { type: "string", example: "juan123" },
        },
      },
      UserUpdate: {
        type: "object",
        properties: {
          name: { type: "string", example: "Juan Perez Lopez" },
          username: { type: "string", example: "juanpl" },
          password: { type: "string", example: "nueva123" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "NOT_FOUND" },
          message: { type: "string", example: "Usuario no encontrado" },
        },
      },
    },
    parameters: {
      UserId: {
        name: "id",
        in: "path",
        required: true,
        description: "ID del usuario",
        schema: { type: "integer", example: 1 },
      },
    },
  },
  paths: {
    "/api/v1/health": {
      get: {
        tags: ["Health"],
        summary: "Verifica que el servicio esté funcionando",
        responses: { 200: { description: "Servicio activo" } },
      },
    },
    "/api/v1/users": {
      get: {
        tags: ["Users"],
        summary: "Obtener todos los usuarios",
        responses: {
          200: {
            description: "Lista de usuarios",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/User" } },
              },
            },
          },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Crear un usuario",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UserInput" } } },
        },
        responses: {
          201: { description: "Usuario creado" },
          400: { description: "Faltan campos obligatorios", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          409: { description: "El username ya existe", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/api/v1/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Obtener un usuario por ID",
        parameters: [{ $ref: "#/components/parameters/UserId" }],
        responses: {
          200: { description: "Usuario encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          404: { description: "Usuario no encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Actualizar un usuario",
        parameters: [{ $ref: "#/components/parameters/UserId" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UserUpdate" } } },
        },
        responses: {
          200: { description: "Usuario actualizado" },
          404: { description: "Usuario no encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          409: { description: "El username ya existe", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Eliminar un usuario",
        parameters: [{ $ref: "#/components/parameters/UserId" }],
        responses: {
          200: { description: "Usuario eliminado" },
          404: { description: "Usuario no encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
  },
};

module.exports = swaggerSpec;