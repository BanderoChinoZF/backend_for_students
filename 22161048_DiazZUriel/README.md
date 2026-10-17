# Microservicio CRUD de Usuarios
**Alumno:** Uriel Diaz Z
**Matrícula:** 22161048
**Práctica:** 1 - Microservicios

## Descripción
Microservicio desarrollado con Node.js y Express que implementa un CRUD completo para la gestión de usuarios.

## Tecnologías
- Node.js
- Express.js
- File System (JSON como base de datos)

## Estructura del Proyecto
```
22161048_DiazZUriel/
├── package.json
├── .env
├── README.md
├── src/
│   ├── server.js          # Servidor principal
│   ├── app.js             # Configuración de Express
│   ├── config/
│   │   └── env.js         # Variables de entorno
│   ├── data/
│   │   └── usuarios.json  # Base de datos JSON
│   └── routes/
│       └── usuarios.routes.js  # Rutas del CRUD
└── reporte/               # Capturas de Postman
```

## Instalación
```bash
cd 22161048_DiazZUriel
npm install
```

## Ejecución
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

## Endpoints

### Base URL
```
http://localhost:3000
```

### Rutas Disponibles

#### 1. GET /
Información de la API
```
GET http://localhost:3000/
```

#### 2. GET /api/v1/usuarios
Obtener todos los usuarios
```
GET http://localhost:3000/api/v1/usuarios
```

#### 3. GET /api/v1/usuarios/:id
Obtener un usuario por ID
```
GET http://localhost:3000/api/v1/usuarios/1
```

#### 4. POST /api/v1/usuarios
Crear un nuevo usuario
```
POST http://localhost:3000/api/v1/usuarios
Content-Type: application/json

{
  "nombre": "Nuevo Usuario",
  "username": "nuevousuario",
  "password": "password123"
}
```

#### 5. PUT /api/v1/usuarios/:id
Actualizar un usuario existente
```
PUT http://localhost:3000/api/v1/usuarios/1
Content-Type: application/json

{
  "nombre": "Usuario Actualizado",
  "username": "usuarioactualizado",
  "password": "newpassword456"
}
```

#### 6. DELETE /api/v1/usuarios/:id
Eliminar un usuario
```
DELETE http://localhost:3000/api/v1/usuarios/1
```

## Datos de Prueba
El archivo `src/data/usuarios.json` contiene 5 usuarios de ejemplo:
- ID: 1-5
- Campos: id, nombre, username, password

## Pruebas
Las pruebas de los endpoints se realizaron con Postman. Las capturas de pantalla se encuentran en la carpeta `/reporte`.
