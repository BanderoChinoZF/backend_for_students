const fs = require("fs");
const path = require("path");

// Ruta del archivo JSON que funciona como nuestra "base de datos"
const DB_PATH = path.join(__dirname, "..", "database", "users.json");

// Lee todos los usuarios del archivo JSON
function readUsers() {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

// Guarda el arreglo de usuarios en el archivo JSON
function writeUsers(users) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

function getAll() {
  return readUsers();
}

function getById(id) {
  return readUsers().find((user) => user.id === id);
}

function create({ name, username, password }) {
  const users = readUsers();
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const newUser = { id: newId, name, username, password };
  users.push(newUser);
  writeUsers(users);
  return newUser;
}

function update(id, { name, username, password }) {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...(name !== undefined && { name }),
    ...(username !== undefined && { username }),
    ...(password !== undefined && { password }),
  };
  writeUsers(users);
  return users[index];
}

function remove(id) {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return null;

  const [deleted] = users.splice(index, 1);
  writeUsers(users);
  return deleted;
}

function usernameExists(username, excludeId) {
  return readUsers().some(
    (user) => user.username === username && user.id !== excludeId
  );
}

module.exports = { getAll, getById, create, update, remove, usernameExists };
