// Controlador: recibe la petición (req), usa el servicio y responde (res)
const usersService = require("../services/users.service");

function getUsers(req, res) {
  res.status(200).json(usersService.getAll());
}

function getUserById(req, res) {
  const id = Number(req.params.id);
  const user = usersService.getById(id);
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  res.status(200).json(user);
}

function createUser(req, res) {
  const { name, username, password } = req.body || {};
  if (!name || !username || !password) {
    return res
      .status(400)
      .json({ message: "Faltan datos: name, username y password son obligatorios" });
  }
  const newUser = usersService.create({ name, username, password });
  res.status(201).json({ message: "Usuario creado", user: newUser });
}

function updateUser(req, res) {
  const id = Number(req.params.id);
  const updated = usersService.update(id, req.body || {});
  if (!updated) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  res.status(200).json({ message: "Usuario actualizado", user: updated });
}

function deleteUser(req, res) {
  const id = Number(req.params.id);
  const deleted = usersService.remove(id);
  if (!deleted) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  res.status(200).json({ message: "Usuario eliminado", user: deleted });
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };