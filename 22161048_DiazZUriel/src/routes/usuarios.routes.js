
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Ruta al archivo JSON de usuarios
const usuariosFilePath = path.join(__dirname, "../data/usuarios.json");

// Función para leer los usuarios del archivo JSON
const leerUsuarios = () => {
  try {
    const data = fs.readFileSync(usuariosFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer usuarios:", error);
    return { usuarios: [] };
  }
};

// Función para escribir usuarios en el archivo JSON
const escribirUsuarios = (data) => {
  try {
    fs.writeFileSync(usuariosFilePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error al escribir usuarios:", error);
    return false;
  }
};

// GET - Obtener todos los usuarios
router.get("/", (req, res) => {
  try {
    const data = leerUsuarios();
    res.status(200).json({
      success: true,
      message: "Usuarios obtenidos correctamente",
      total: data.usuarios.length,
      data: data.usuarios,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
});

// GET - Obtener un usuario por ID
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const data = leerUsuarios();
    const usuario = data.usuarios.find((u) => u.id === parseInt(id));

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario encontrado",
      data: usuario,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
});

// POST - Crear un nuevo usuario
router.post("/", (req, res) => {
  try {
    const { nombre, username, password } = req.body;

    // Validaciones
    if (!nombre || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos: nombre, username, password",
      });
    }

    const data = leerUsuarios();

    // Verificar si el username ya existe
    const usuarioExistente = data.usuarios.find((u) => u.username === username);
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: "El username ya existe",
      });
    }

    // Generar nuevo ID
    const nuevoId =
      data.usuarios.length > 0
        ? Math.max(...data.usuarios.map((u) => u.id)) + 1
        : 1;

    // Crear nuevo usuario
    const nuevoUsuario = {
      id: nuevoId,
      nombre,
      username,
      password,
    };

    data.usuarios.push(nuevoUsuario);

    // Guardar en el archivo
    if (!escribirUsuarios(data)) {
      return res.status(500).json({
        success: false,
        message: "Error al guardar el usuario",
      });
    }

    res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      data: nuevoUsuario,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear usuario",
      error: error.message,
    });
  }
});

// PUT - Actualizar un usuario existente
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, username, password } = req.body;

    const data = leerUsuarios();
    const indiceUsuario = data.usuarios.findIndex((u) => u.id === parseInt(id));

    if (indiceUsuario === -1) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
      });
    }

    // Verificar si el nuevo username ya existe (excepto en el usuario actual)
    if (username) {
      const usuarioExistente = data.usuarios.find(
        (u) => u.username === username && u.id !== parseInt(id)
      );
      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          message: "El username ya existe",
        });
      }
    }

    // Actualizar usuario
    const usuarioActualizado = {
      ...data.usuarios[indiceUsuario],
      nombre: nombre || data.usuarios[indiceUsuario].nombre,
      username: username || data.usuarios[indiceUsuario].username,
      password: password || data.usuarios[indiceUsuario].password,
    };

    data.usuarios[indiceUsuario] = usuarioActualizado;

    // Guardar en el archivo
    if (!escribirUsuarios(data)) {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar el usuario",
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: usuarioActualizado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
});

// DELETE - Eliminar un usuario
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const data = leerUsuarios();
    const indiceUsuario = data.usuarios.findIndex((u) => u.id === parseInt(id));

    if (indiceUsuario === -1) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
      });
    }

    const usuarioEliminado = data.usuarios[indiceUsuario];
    data.usuarios.splice(indiceUsuario, 1);

    // Guardar en el archivo
    if (!escribirUsuarios(data)) {
      return res.status(500).json({
        success: false,
        message: "Error al eliminar el usuario",
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente",
      data: usuarioEliminado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
});

module.exports = router;
