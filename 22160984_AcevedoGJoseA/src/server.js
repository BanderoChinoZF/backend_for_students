const app = require("./app");
const env = require("./config/env");
const db = require("./database/db");

const server = app.listen(env.port, async () => {
  console.log(`[${env.serviceName}] corriendo en el puerto ${env.port}`);
  
  try {
    await db.query("SELECT 1;");
    console.log("[PostgreSQL] Conectado exitosamente a la base de datos.");
  } catch (error) {
    console.warn("[PostgreSQL] Aviso: No se pudo conectar a la base de datos. Asegurate de que Docker / PostgreSQL este corriendo.");
  }
});

function shutdown(signal) {
  console.log(`Recibida señal ${signal}. Cerrando servidor...`);

  server.close(async (error) => {
    try {
      await db.pool.end();
    } catch (_) {}

    if (error) {
      console.error("Error al cerrar el servidor:", error);
      process.exitCode = 1;
      return;
    }
    process.exitCode = 0;
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
