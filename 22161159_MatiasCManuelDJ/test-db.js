

require("dotenv").config();

const pool = require("./src/database/db");

async function probarConexion() {
  try {
    const resultado = await pool.query(
      "SELECT current_database() AS base, NOW() AS fecha"
    );

    console.log("Conexión exitosa con PostgreSQL:");
    console.log(resultado.rows[0]);
  } catch (error) {
    console.error("Error de conexión:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

probarConexion();
