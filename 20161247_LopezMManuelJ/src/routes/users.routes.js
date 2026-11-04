const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dbPath = path.join(__dirname, "../database/users.json");

const getUsers = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const saveUsers = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * /api/v1/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", (req, res) => {
  const users = getUsers();
  // Estructura exigida por el profe
  res.status(200).json({
    total: users.length,
    data: users
  });
});

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", (req, res) => {
  const users = getUsers();
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  res.status(200).json(user);
});

/**
 * @swagger
 * /api/v1/usuarios:
 *   post:
 *     summary: Crear un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
     *             type: object
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post("/", (req, res) => {
  const users = getUsers();
  const newUser = req.body;
  newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ message: "Usuario creado", data: newUser });
});

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
     *             type: object
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put("/:id", (req, res) => {
  const users = getUsers();
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) return res.status(404).json({ message: "Usuario no encontrado" });

  users[index] = { ...users[index], ...req.body, id: id };
  saveUsers(users);
  res.status(200).json({ message: "Usuario actualizado", data: users[index] });
});

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete("/:id", (req, res) => {
  let users = getUsers();
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) return res.status(404).json({ message: "Usuario no encontrado" });

  users = users.filter((u) => u.id !== id);
  saveUsers(users);
  res.status(200).json({ message: "Usuario eliminado correctamente" });
});

module.exports = router;