const usersService = require("../services/users.service");

// Las funciones ahora son async porque consultar la base de datos tarda (es una promesa).
// Si una consulta falla, Express 5 manda el error al middleware de errores de app.js.

// GET /api/v1/users
async function getUsers(req, res) {
  const users = await usersService.getAll();
  res.status(200).json(users);
}

// GET /api/v1/users/:id
async function getUserById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "El id debe ser un número" });
  }

  const user = await usersService.getById(id);
  if (!user) {
    return res.status(404).json({ error: "NOT_FOUND", message: "Usuario no encontrado" });
  }
  res.status(200).json(user);
}

// POST /api/v1/users
async function createUser(req, res) {
  const { name, username, password } = req.body || {};

  if (!name || !username || !password) {
    return res.status(400).json({
      error: "BAD_REQUEST",
      message: "Los campos name, username y password son obligatorios",
    });
  }
  if (await usersService.usernameExists(username)) {
    return res.status(409).json({ error: "CONFLICT", message: "El username ya existe" });
  }

  const newUser = await usersService.create({ name, username, password });
  res.status(201).json({ message: "Usuario creado", user: newUser });
}

// PUT /api/v1/users/:id
async function updateUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "El id debe ser un número" });
  }
  const { name, username, password } = req.body || {};

  if (username && (await usersService.usernameExists(username, id))) {
    return res.status(409).json({ error: "CONFLICT", message: "El username ya existe" });
  }

  const updated = await usersService.update(id, { name, username, password });
  if (!updated) {
    return res.status(404).json({ error: "NOT_FOUND", message: "Usuario no encontrado" });
  }
  res.status(200).json({ message: "Usuario actualizado", user: updated });
}

// DELETE /api/v1/users/:id
async function deleteUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "El id debe ser un número" });
  }

  const deleted = await usersService.remove(id);
  if (!deleted) {
    return res.status(404).json({ error: "NOT_FOUND", message: "Usuario no encontrado" });
  }
  res.status(200).json({ message: "Usuario eliminado", user: deleted });
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };