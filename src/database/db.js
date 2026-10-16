const { Pool } = require("pg");
const env = require("../config/env");

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  ssl: env.db.ssl,
});

pool.on("error", (err) => {
  console.error("Error inesperado en PostgreSQL:", err.message);
});

const query = (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query,
};
