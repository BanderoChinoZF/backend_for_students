const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "database", "usuarios.json");

function leerDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}
function guardarDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}
// Nunca devolvemos la contraseña
function sinPassword(usuario) {
  const { Password, ...resto } = usuario;
  return resto;
}

function obtenerTodos() {
  return leerDB().usuarios.map(sinPassword);
}
function obtenerPorId(id) {
  const u = leerDB().usuarios.find((x) => x.id === id);
  return u ? sinPassword(u) : null;
}
function existeUsername(username, ignorarId = null) {
  return leerDB().usuarios.some((u) => u.Username === username && u.id !== ignorarId);
}
function crear({ Username, Password, Nameuser }) {
  const db = leerDB();
  const id = db.usuarios.length ? Math.max(...db.usuarios.map((u) => u.id)) + 1 : 1;
  const nuevo = { id, Username, Password, Nameuser };
  db.usuarios.push(nuevo);
  guardarDB(db);
  return sinPassword(nuevo);
}
function actualizar(id, { Username, Password, Nameuser }) {
  const db = leerDB();
  const i = db.usuarios.findIndex((u) => u.id === id);
  if (i === -1) return null;
  db.usuarios[i] = { id, Username, Password, Nameuser };
  guardarDB(db);
  return sinPassword(db.usuarios[i]);
}
function eliminar(id) {
  const db = leerDB();
  const i = db.usuarios.findIndex((u) => u.id === id);
  if (i === -1) return null;
  const [eliminado] = db.usuarios.splice(i, 1);
  guardarDB(db);
  return sinPassword(eliminado);
}

module.exports = { obtenerTodos, obtenerPorId, existeUsername, crear, actualizar, eliminar };
