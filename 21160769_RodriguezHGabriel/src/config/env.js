//Importamos la librería dotenv para poder leer las variables de entorno desde un archivo .env
require("dotenv").config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  serviceName:
    process.env.SERVICE_NAME || "First Microservice - Backend for Students",

  //Datos del proyecto de Supabase (Project Settings -> API Keys)
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_KEY || "",
};

//Funcion que exportamos para poder usar las variables de entorno en otros archivos
module.exports = env;
