// Servicio: se encarga de leer y escribir el archivo JSON (nuestra "base de datos")
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../database/users.json");

function readUsers() {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

function getAll() {
  return readUsers();
}

function getById(id) {
  return readUsers().find((u) => u.id === id);
}

function create({ name, username, password }) {
  const users = readUsers();
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const newUser = { id: newId, name, username, password };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

function update(id, { name, username, password }) {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...(name !== undefined && { name }),
    ...(username !== undefined && { username }),
    ...(password !== undefined && { password }),
  };
  saveUsers(users);
  return users[index];
}

function remove(id) {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const [deleted] = users.splice(index, 1);
  saveUsers(users);
  return deleted;
}

module.exports = { getAll, getById, create, update, remove };