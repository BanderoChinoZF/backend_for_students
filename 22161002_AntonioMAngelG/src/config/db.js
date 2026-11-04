// Conexión a la base de datos PostgreSQL de Supabase
const { Pool } = require("pg");
const env = require("./env");

// Un Pool mantiene varias conexiones abiertas y las reutiliza en cada consulta
const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false }, // Supabase exige conexión cifrada (SSL)
});

// Verifica que la conexión funcione al arrancar el servidor
async function testConnection() {
  const result = await pool.query("SELECT NOW() AS now");
  console.log(`[DB] Conectado a Supabase. Hora del servidor: ${result.rows[0].now}`);
}

module.exports = { pool, testConnection };