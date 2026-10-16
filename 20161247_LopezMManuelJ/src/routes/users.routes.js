const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const dbPath = path.join(__dirname, "../database/users.json");

const getUsers = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const saveUsers = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

router.get("/", (req, res) => {
  const users = getUsers();
  res.status(200).json(users);
});

router.post("/", (req, res) => {
  const users = getUsers();
  const newUser = req.body;
    
  newUser.id_usuario = users.length > 0 ? users[users.length - 1].id_usuario + 1 : 1;
  
  users.push(newUser);
  saveUsers(users);
  
  res.status(201).json({ message: "Usuario creado", data: newUser });
});

router.put("/:id", (req, res) => {
  const users = getUsers();
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id_usuario === id);

  if (index === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  
  users[index] = { ...users[index], ...req.body, id_usuario: id };
  saveUsers(users);

  res.status(200).json({ message: "Usuario actualizado", data: users[index] });
});

router.delete("/:id", (req, res) => {
  let users = getUsers();
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id_usuario === id);

  if (index === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  
  users = users.filter((u) => u.id_usuario !== id);
  saveUsers(users);

  res.status(200).json({ message: "Usuario eliminado correctamente" });
});

module.exports = router;