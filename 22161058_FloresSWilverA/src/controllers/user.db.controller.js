// src/controllers/user.db.controller.js
// Controlador de la base de datos PostgreSQL alojada en Supabase

const userDbService = require("../services/user.db.service");

// GET /api/v1/db/users
async function getUsers(req, res) {
  try {
    const users = await userDbService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "INTERNAL_ERROR", message: error.message });
  }
}

// GET /api/v1/db/users/:id
async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await userDbService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: `Usuario con id ${id} no encontrado en Supabase`,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "INTERNAL_ERROR", message: error.message });
  }
}

// POST /api/v1/db/users
async function createUser(req, res) {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "Los campos 'name', 'email', 'username' y 'password' son obligatorios",
      });
    }

    const newUser = await userDbService.createUser({ name, email, username, password });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        error: "DUPLICATE_ENTRY",
        message: "El email o username ya se encuentra registrado",
      });
    }
    res.status(500).json({ error: "INTERNAL_ERROR", message: error.message });
  }
}

// PUT /api/v1/db/users/:id
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, username, password } = req.body;

    const updatedUser = await userDbService.updateUser(id, { name, email, username, password });

    if (!updatedUser) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: `Usuario con id ${id} no encontrado en Supabase`,
      });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        error: "DUPLICATE_ENTRY",
        message: "El email o username ya está en uso por otro usuario",
      });
    }
    res.status(500).json({ error: "INTERNAL_ERROR", message: error.message });
  }
}

// DELETE /api/v1/db/users/:id
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const deleted = await userDbService.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: `Usuario con id ${id} no encontrado en Supabase`,
      });
    }

    res.status(200).json({
      message: `Usuario con id ${id} eliminado correctamente de Supabase`,
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