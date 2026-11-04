const { pool } = require("../config/db");

// Cada función hace una consulta SQL a la tabla users.
// Los $1, $2... son parámetros: pg los reemplaza de forma segura (evita inyección SQL).

async function getAll() {
  const result = await pool.query("SELECT id, name, username, password FROM users ORDER BY id");
  return result.rows;
}

async function getById(id) {
  const result = await pool.query(
    "SELECT id, name, username, password FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0]; // undefined si no existe
}

async function create({ name, username, password }) {
  const result = await pool.query(
    `INSERT INTO users (name, username, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, username, password`,
    [name, username, password]
  );
  return result.rows[0];
}

async function update(id, { name, username, password }) {
  // COALESCE deja el valor actual si el campo no viene en la petición
  const result = await pool.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         username = COALESCE($2, username),
         password = COALESCE($3, password)
     WHERE id = $4
     RETURNING id, name, username, password`,
    [name ?? null, username ?? null, password ?? null, id]
  );
  return result.rows[0] || null;
}

async function remove(id) {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id, name, username, password",
    [id]
  );
  return result.rows[0] || null;
}

async function usernameExists(username, excludeId) {
  const result = await pool.query(
    "SELECT 1 FROM users WHERE username = $1 AND id <> $2",
    [username, excludeId ?? 0]
  );
  return result.rowCount > 0;
}

module.exports = { getAll, getById, create, update, remove, usernameExists };