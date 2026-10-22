const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../data/users.json");

const leer = () => JSON.parse(fs.readFileSync(file, "utf8"));
const guardar = (data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

const getAll = () => leer();

const getById = (id) => leer().find((u) => u.id === Number(id));

const create = (data) => {
  const users = leer();
  const nuevo = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    ...data,
  };
  users.push(nuevo);
  guardar(users);
  return nuevo;
};

const update = (id, data) => {
  const users = leer();
  const i = users.findIndex((u) => u.id === Number(id));
  if (i === -1) return null;
  users[i] = { ...users[i], ...data, id: users[i].id };
  guardar(users);
  return users[i];
};

const remove = (id) => {
  const users = leer();
  const i = users.findIndex((u) => u.id === Number(id));
  if (i === -1) return null;
  const [borrado] = users.splice(i, 1);
  guardar(users);
  return borrado;
};

module.exports = { getAll, getById, create, update, remove };