const db = require("../database/db");


//obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM sp_obtener_usuarios();");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//obtener un usuario por id
const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM sp_obtener_usuario_por_id($1);",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//crear un usuario recibe nombre, contraseña, username
const createUsuario = async (req, res) => {
  try {
    const { nombre, username, contrasena, contraseña } = req.body;
    const password = contrasena || contraseña;

    if (!nombre || !username || !password) {
      return res.status(400).json({
        error: "Los campos 'nombre', 'username' y 'contrasena' son obligatorios.",
      });
    }

    const result = await db.query(
      "SELECT * FROM sp_crear_usuario($1, $2, $3);",
      [nombre, username, password]
    );

    res.status(201).json({
      mensaje: "Usuario creado exitosamente en PostgreSQL",
      usuario: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "El username ya esta registrado." });
    }
    res.status(500).json({ error: error.message });
  }
};

//actualizar un usuario por id
const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, username, contrasena, contraseña } = req.body;
    const password = contrasena || contraseña;

    const result = await db.query(
      "SELECT * FROM sp_actualizar_usuario($1, $2, $3, $4);",
      [id, nombre || null, username || null, password || null]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({
      mensaje: "Usuario actualizado exitosamente en PostgreSQL",
      usuario: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "El username ya esta en uso." });
    }
    res.status(500).json({ error: error.message });
  }
};

//eliminar un usuario por id
const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM sp_eliminar_usuario($1);",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({
      mensaje: "Usuario eliminado exitosamente en PostgreSQL",
      usuario: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
