// src/controllers/user.controller.js

const userService = require("../services/user.service");

// GET /api/v1/users
async function getUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "INTERNAL_ERROR", message: error.message });
  }
}

// GET /api/v1/users/:id
async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: `Usuario con id ${id} no encontrado`,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "INTERNAL_ERROR", message: error.message });
  }
}

// POST /api/v1/users
async function createUser(req, res) {
  try {
    const { name, username, password } = req.body;

    // Validación básica de campos requeridos
    if (!name || !username || !password) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "Los campos 'name', 'username' y 'password' son obligatorios",
      });
    }

    const newUser = await userService.createUser({ name, username, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "INTERNAL_ERROR", message: error.message });
  }
}

// PUT /api/v1/users/:id
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, username, password } = req.body;

    const updatedUser = await userService.updateUser(id, { name, username, password });

    if (!updatedUser) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: `Usuario con id ${id} no encontrado`,
      });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "INTERNAL_ERROR", message: error.message });
  }
}

// DELETE /api/v1/users/:id
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: `Usuario con id ${id} no encontrado`,
      });
    }

    res.status(200).json({
      message: `Usuario con id ${id} eliminado correctamente`,
    });
  } catch (error) {
    res.status(500).json({ error: "INTERNAL_ERROR", message: error.message });
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};