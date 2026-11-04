const usersService = require("../services/users.service");

// GET /api/v1/users
function getUsers(req, res) {
  const users = usersService.getAll();
  res.status(200).json(users);
}

// GET /api/v1/users/:id
function getUserById(req, res) {
  const id = Number(req.params.id);
  const user = usersService.getById(id);

  if (!user) {
    return res.status(404).json({ error: "NOT_FOUND", message: "Usuario no encontrado" });
  }
  res.status(200).json(user);
}

// POST /api/v1/users
function createUser(req, res) {
  const { name, username, password } = req.body || {};

  if (!name || !username || !password) {
    return res.status(400).json({
      error: "BAD_REQUEST",
      message: "Los campos name, username y password son obligatorios",
    });
  }
  if (usersService.usernameExists(username)) {
    return res.status(409).json({ error: "CONFLICT", message: "El username ya existe" });
  }

  const newUser = usersService.create({ name, username, password });
  res.status(201).json({ message: "Usuario creado", user: newUser });
}

// PUT /api/v1/users/:id
function updateUser(req, res) {
  const id = Number(req.params.id);
  const { name, username, password } = req.body || {};

  if (username && usersService.usernameExists(username, id)) {
    return res.status(409).json({ error: "CONFLICT", message: "El username ya existe" });
  }

  const updated = usersService.update(id, { name, username, password });
  if (!updated) {
    return res.status(404).json({ error: "NOT_FOUND", message: "Usuario no encontrado" });
  }
  res.status(200).json({ message: "Usuario actualizado", user: updated });
}

// DELETE /api/v1/users/:id
function deleteUser(req, res) {
  const id = Number(req.params.id);
  const deleted = usersService.remove(id);

  if (!deleted) {
    return res.status(404).json({ error: "NOT_FOUND", message: "Usuario no encontrado" });
  }
  res.status(200).json({ message: "Usuario eliminado", user: deleted });
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
