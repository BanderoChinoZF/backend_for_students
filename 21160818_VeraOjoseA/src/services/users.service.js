// src/services/users.service.js
const users = require("../database/users");

// siguiente id disponible
let nextId = Math.max(0, ...users.map((u) => u.id)) + 1;

const getAll = () => users;

const getById = (id) => users.find((u) => u.id === id);

const getByUsername = (username) => users.find((u) => u.username === username);

const create = ({ nombre, username, password }) => {
  const newUser = { id: nextId++, nombre, username, password };
  users.push(newUser);
  return newUser;
};

const update = (id, { nombre, username, password }) => {
  const user = getById(id);
  if (!user) return null;

  if (nombre !== undefined) user.nombre = nombre;
  if (username !== undefined) user.username = username;
  if (password !== undefined) user.password = password;

  return user;
};

const remove = (id) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;

  users.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, getByUsername, create, update, remove };