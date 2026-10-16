const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const databasePath = path.join(
  __dirname,
  "../database/users.json"
);

// leeemos los usuarios del jsosn
function readUsers() {
  const data = fs.readFileSync(databasePath, "utf8");
  return JSON.parse(data);
}

// aqui guarsdaremos los usauoris en el jason
function writeUsers(users) {
  fs.writeFileSync(
    databasePath,
    JSON.stringify(users, null, 2),
    "utf8"
  );
}

// GET aqui vamos a obtener todooos los usuariossin
router.get("/", (req, res) => {
  const users = readUsers();

  res.status(200).json(users);
});

// GET - Obtener un usuario por username
router.get("/:username", (req, res) => {
  const users = readUsers();

  const user = users.find(
    (item) => item.username === req.params.username
  );

  if (!user) {
    return res.status(404).json({
      error: "USER_NOT_FOUND",
      message: "Usuario no encontrado",
    });
  }

  res.status(200).json(user);
});

// POST aqui vmaos a crrear un usuarioo
router.post("/", (req, res) => {
  const { nombre, username, contrasena } = req.body;

  if (!nombre || !username || !contrasena) {
    return res.status(400).json({
      error: "INVALID_DATA",
      message: "nombre, username y contrasena son obligatorios",
    });
  }

  const users = readUsers();

  const exists = users.some(
    (item) => item.username === username
  );

  if (exists) {
    return res.status(409).json({
      error: "USER_EXISTS",
      message: "El username ya existe",
    });
  }

  const newUser = {
    nombre,
    username,
    contrasena,
  };

  users.push(newUser);

  writeUsers(users);

  res.status(201).json(newUser);
});

// PUT es el que actualize un usuaurio
router.put("/:username", (req, res) => {
  const users = readUsers();

  const index = users.findIndex(
    (item) => item.username === req.params.username
  );

  if (index === -1) {
    return res.status(404).json({
      error: "USER_NOT_FOUND",
      message: "Usuario no encontrado",
    });
  }

  const { nombre, username, contrasena } = req.body;

  users[index] = {
    nombre: nombre ?? users[index].nombre,
    username: username ?? users[index].username,
    contrasena: contrasena ?? users[index].contrasena,
  };

  writeUsers(users);

  res.status(200).json(users[index]);
});

// DELETE el que v a a eliminar un usuario
router.delete("/:username", (req, res) => {
  const users = readUsers();

  const index = users.findIndex(
    (item) => item.username === req.params.username
  );

  if (index === -1) {
    return res.status(404).json({
      error: "USER_NOT_FOUND",
      message: "Usuario no encontrado",
    });
  }

  const deletedUser = users.splice(index, 1);

  writeUsers(users);

  res.status(200).json({
    message: "Usuario eliminado correctamente",
    user: deletedUser[0],
  });
});

module.exports = router;