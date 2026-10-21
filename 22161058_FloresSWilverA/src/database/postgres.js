// src/database.js

const { Pool } = require("pg");
const env = require("../config/env"); // Sube un nivel a src/ y entra a config/

if (!env.databaseUrl) {
  console.error("[Database Error] La variable DATABASE_URL no está definida en el archivo .env");
}

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: {
    rejectUnauthorized: false, // Necesario para la conexión SSL de Supabase
  },
});

pool.on("connect", () => {
  console.log("[Database] Conexión establecida exitosamente con Supabase (PostgreSQL)");
});

pool.on("error", (err) => {
  console.error("[Database] Error inesperado en el pool de conexión:", err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};