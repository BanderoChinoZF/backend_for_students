
const app = require("./app");
const env = require("./config/env");
const { testConnection } = require("./config/db");   // NUEVO

const server = app.listen(env.port, () => {
  console.log(
    `[${env.serviceName}] listening on port ${env.port}`
  );
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

testConnection().catch((error) => {
    console.error("[DB] No se pudo conectar a Supabase:", error.message);
  });
  