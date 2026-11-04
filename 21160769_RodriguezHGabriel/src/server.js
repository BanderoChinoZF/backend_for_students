
const app = require("./app");
const env = require("./config/env");
const { probarConexion } = require("./config/db");

const server = app.listen(env.port, async () => {
  console.log(
    `[${env.serviceName}] listening on port ${env.port}`
  );

  //Verificamos la conexión a Supabase al iniciar el servidor
  try {
    await probarConexion();
    console.log("Conectado a la base de datos de Supabase");
  } catch (error) {
    console.error("No se pudo conectar a Supabase:", error.message);
  }
});

function shutdown(signal) {
  console.log(`Received ${signal}. Closing server...`);

  server.close((error) => {
    if (error) {
      console.error("Error closing server:", error);
      process.exitCode = 1;
      return;
    }

    process.exitCode = 0;
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
