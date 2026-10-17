// src/controllers/users.controller.js
const usersService = require("../services/users.service");

// GET /api/v1/users
const getUsers = (req, res) => {
  res.status(200).json(usersService.getAll());
};

// GET /api/v1/users/:id
const getUser = (req, res) => {
  const user = usersService.getById(Number(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  res.status(200).json(user);
};

// POST /api/v1/users
const createUser = (req, res) => {
  const { nombre, username, password } = req.body;

  if (usersService.getByUsername(username)) {
    return res.status(409).json({ error: "El username ya existe" });
  }

  const newUser = usersService.create({ nombre, username, password });
  res.status(201).json(newUser);
};

// PUT /api/v1/users/:id
const updateUser = (req, res) => {
  const id = Number(req.params.id);
  const { username } = req.body;

  const existing = username && usersService.getByUsername(username);
  if (existing && existing.id !== id) {
    return res.status(409).json({ error: "El username ya existe" });
  }

  const user = usersService.update(id, req.body);
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  res.status(200).json(user);
};

// DELETE /api/v1/users/:id
const deleteUser = (req, res) => {
  const deleted = usersService.remove(Number(req.params.id));
  if (!deleted) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  res.status(200).json({ message: "Usuario eliminado" });
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };