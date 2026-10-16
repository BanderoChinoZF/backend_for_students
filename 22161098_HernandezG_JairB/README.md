# backend_for_students
Este repositorio es creado con la base minima de un microservicio con NodeJS y Express 

TENDREMOS LA SIGUIENTE DISTRIBUCIÓN DE CARPETAS DENTRO DEL PROYECTO,
RECORDAR LO VISTO EN CLASE EN DONDE CADA CARPETA NOS AYUDA A TENER UN ORDEN EN NUESTROS ARCHIVOS.

├── src/
│   ├── config/  **configuraciones del servidor
│   │   └── env.js
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   │   └── health.routes.js  **rutas definidas
│   ├── services/
│   ├── app.js
│   └── server.js
├── tests/
├── .env
├── .env.example
├── .gitignore
└── package.json

Utilizaremos los siguientes dependencias
-> Express
-> cors
-> helmet
-> dotenv

y dependencias de desarrollo como lo son
-> nodemon

