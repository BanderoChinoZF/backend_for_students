const { Client } = require("pg");
const env = require("../config/env");

const client = new Client({
  connectionString: env.URL_DB,
  ssl: env.dbSsl ? { rejectUnauthorized: true } : false,
});

let connectionPromise;

async function conectar() {
  if (!env.URL_DB) {
    throw new Error("Falta configurar URL_DB en el archivo .env");
  }

  if (!connectionPromise) {
    connectionPromise = client.connect().catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
}

async function probarConexion() {
  await conectar();
  const resultado = await client.query("SELECT NOW() AS fecha");
  console.log("Conexión a PostgreSQL exitosa:", resultado.rows[0].fecha);
}

async function cerrarConexion() {
  if (connectionPromise) {
    await client.end();
    connectionPromise = undefined;
  }
}

module.exports = {
  client,
  conectar,
  probarConexion,
  cerrarConexion,
};
