
const usersService = require("../services/users.service");

function getDatabase(req) {
  return req.app.locals.db;
}

function handleError(res, error) {
  console.error(error);
  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "Ocurrió un error al procesar la solicitud",
  });
}

async function createUser(req, res) {
  try {
    const { nombre_usuario, username, password } = req.body;

    if (
      typeof nombre_usuario !== "string" ||
      !nombre_usuario.trim() ||
      typeof username !== "string" ||
      !username.trim() ||
      typeof password !== "string" ||
      !password.trim()
    ) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "nombre_usuario, username y password son obligatorios",
      });
    }

    const user = await usersService.createUser(getDatabase(req), {
      nombre_usuario: nombre_usuario.trim(),
      username: username.trim(),
      password,
    });

    return res.status(201).json({
      message: "Usuario creado correctamente",
      data: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await usersService.getAllUsers(getDatabase(req));
    return res.status(200).json({ data: users });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getUserById(req, res) {
  try {
    const user = await usersService.getUserById(
      getDatabase(req),
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    return handleError(res, error);
  }
}

async function updateUser(req, res) {
  try {
    const user = await usersService.updateUser(
      getDatabase(req),
      req.params.id,
      req.body
    );

    if (!user) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Usuario no encontrado o no hay campos para actualizar",
      });
    }

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      data: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function deleteUser(req, res) {
  try {
    const deleted = await usersService.deleteUser(
      getDatabase(req),
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
