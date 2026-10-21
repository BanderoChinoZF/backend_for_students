// src/config/env.js

//Importamos la librería dotenv para poder leer las variables de entorno desde un archivo .env
require("dotenv").config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  serviceName: process.env.SERVICE_NAME || "First Microservice - Backend for Students",
  databaseUrl: process.env.DATABASE_URL,
};

//Funcion que exportamos para poder usar las variables de entorno en otros archivos
module.exports = env;
