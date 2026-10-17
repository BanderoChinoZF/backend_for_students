
const app = require("./app");
const env = require("./config/env");
const { connectToDatabase, client } = require("./config/database");

async function startServer() {
  try {
    const db = await connectToDatabase();

    // Compartimos la conexión con las rutas del microservicio
    app.locals.db = db;

    const server = app.listen(env.port, () => {
      console.log(
        `[${env.serviceName}] listening on port ${env.port}`
      );
    });

    async function shutdown(signal) {
      console.log(`Received ${signal}. Closing server...`);

      server.close(async (error) => {
        if (error) {
          console.error("Error closing server:", error);
          process.exitCode = 1;
        }

        try {
          await client.close();
        } catch (closeError) {
          console.error("Error closing MongoDB:", closeError);
          process.exitCode = 1;
        }
      });
    }

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Error al iniciar el microservicio:", error);
    await client.close().catch(() => {});
    process.exitCode = 1;
  }
}

startServer();
