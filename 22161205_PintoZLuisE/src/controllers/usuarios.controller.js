const service = require("../services/usuarios.service");

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "BAD_REQUEST", message: "id inválido" });
    return null;
  }
  return id;
}
const noEncontrado = (res) =>
  res.status(404).json({ error: "NOT_FOUND", message: "Usuario no encontrado" });
const duplicado = (res) =>
  res.status(409).json({ error: "CONFLICT", message: "El Username ya existe" });

function getUsuarios(req, res) {
  res.status(200).json(service.obtenerTodos());
}
function getUsuarioById(req, res) {
  const id = parseId(req, res); if (id === null) return;
  const u = service.obtenerPorId(id);
  return u ? res.status(200).json(u) : noEncontrado(res);
}
function createUsuario(req, res) {
  if (service.existeUsername(req.body.Username)) return duplicado(res);
  res.status(201).json(service.crear(req.body));
}
function updateUsuario(req, res) {
  const id = parseId(req, res); if (id === null) return;
  if (service.existeUsername(req.body.Username, id)) return duplicado(res);
  const u = service.actualizar(id, req.body);
  return u ? res.status(200).json(u) : noEncontrado(res);
}
function deleteUsuario(req, res) {
  const id = parseId(req, res); if (id === null) return;
  const u = service.eliminar(id);
  return u
    ? res.status(200).json({ message: "Usuario eliminado", usuario: u })
    : noEncontrado(res);
}

module.exports = { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario };
