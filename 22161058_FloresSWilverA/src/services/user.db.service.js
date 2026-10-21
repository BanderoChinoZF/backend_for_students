// src/services/user.db.service.js
// Handler para la base de datos de usuarios en Supabase

const db = require("../database/postgres");

// 1. Obtener todos los usuarios de Supabase
async function getAllUsers() {
  const result = await db.query(
    "SELECT id, name, email, username, created_at FROM usuarios ORDER BY id ASC"
  );
  return result.rows;
}

// 2. Obtener un usuario por ID
async function getUserById(id) {
  const result = await db.query(
    "SELECT id, name, email, username, created_at FROM usuarios WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
}

// 3. Crear un nuevo usuario
async function createUser(userData) {
  const { name, email, username, password } = userData;
  const result = await db.query(
    `INSERT INTO usuarios (name, email, username, password) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, email, username, created_at`,
    [name, email, username, password]
  );
  return result.rows[0];
}

// 4. Actualizar un usuario existente
async function updateUser(id, updateData) {
  const { name, email, username, password } = updateData;

  const result = await db.query(
    `UPDATE usuarios 
     SET name = COALESCE($1, name),
         email = COALESCE($2, email),
         username = COALESCE($3, username),
         password = COALESCE($4, password)
     WHERE id = $5 
     RETURNING id, name, email, username, created_at`,
    [name, email, username, password, id]
  );

  return result.rows[0] || null;
}

// 5. Eliminar un usuario por ID
async function deleteUser(id) {
  const result = await db.query(
    "DELETE FROM usuarios WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rowCount > 0;
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};