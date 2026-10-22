const service = require("../services/users.service");

const notFound = (res) =>
  res.status(404).json({ error: "NOT_FOUND", message: "Usuario no encontrado" });

const getAll = (req, res) => {
  res.status(200).json(service.getAll());
};

const getById = (req, res) => {
  const user = service.getById(req.params.id);
  if (!user) return notFound(res);
  res.status(200).json(user);
};

const create = (req, res) => {
  const { nombre, correo, edad } = req.body;
  if (!nombre || !correo) {
    return res
      .status(400)
      .json({ error: "BAD_REQUEST", message: "nombre y correo son obligatorios" });
  }
  res.status(201).json(service.create({ nombre, correo, edad }));
};

const update = (req, res) => {
  const user = service.update(req.params.id, req.body);
  if (!user) return notFound(res);
  res.status(200).json(user);
};

const remove = (req, res) => {
  const borrado = service.remove(req.params.id);
  if (!borrado) return notFound(res);
  res.status(200).json({ message: "Usuario eliminado", borrado });
};

module.exports = { getAll, getById, create, update, remove };