
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../database/db");

const router = express.Router();

// POST /api/v1/usuarios
router.post("/", async (req, res) => {
  try {
    const { nombre, username, password } = req.body;

    if (
      typeof nombre !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string" ||
      !nombre.trim() ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: "Nombre, username y password son obligatorios"
      });
    }

    if (
      nombre.length > 100 ||
      username.length > 50 ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        error: "Revisa las longitudes de los campos. La contraseña debe tener al menos 8 caracteres y no superar 72 bytes."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, username, creado_en`,
      [nombre.trim(), username.trim(), passwordHash]
    );

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: resultado.rows[0]
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "El username ya está registrado"
      });
    }

    console.error("Error al registrar usuario:", error);
    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

/* GET - Consultar todos los usuarios */
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, nombre, username, creado_en
       FROM usuarios
       ORDER BY id ASC`
    );

    res.status(200).json({
      total: resultado.rows.length,
      usuarios: resultado.rows
    });

  } catch (error) {
    console.error("Error al consultar usuarios:", error);

    res.status(500).json({
      error: "Error al consultar usuarios"
    });
  }
});

/* GET - Consultar un usuario por ID */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        error: "El ID debe ser un entero positivo"
      });
    }

    const resultado = await pool.query(
      `SELECT id, nombre, username, creado_en
       FROM usuarios
       WHERE id = $1`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    res.status(200).json(resultado.rows[0]);

  } catch (error) {
    console.error("Error al consultar usuario:", error);

    res.status(500).json({
      error: "Error al consultar usuario"
    });
  }
});

/* PUT - Actualizar usuario por ID */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, username, password } = req.body;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        error: "El ID debe ser un entero positivo"
      });
    }

    if (
      typeof nombre !== "string" ||
      typeof username !== "string" ||
      !nombre.trim() ||
      !username.trim() ||
      nombre.length > 100 ||
      username.length > 50
    ) {
      return res.status(400).json({
        error: "Nombre y username válidos son obligatorios"
      });
    }

    if (
      password !== undefined &&
      (typeof password !== "string" ||
       password.length < 8 ||
       Buffer.byteLength(password, "utf8") > 72)
    ) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 8 caracteres y no superar 72 bytes"
      });
    }

    let resultado;

    if (password !== undefined) {
      const passwordHash = await bcrypt.hash(password, 12);

      resultado = await pool.query(
        `UPDATE usuarios
         SET nombre = $1, username = $2, password_hash = $3
         WHERE id = $4
         RETURNING id, nombre, username, creado_en`,
        [nombre.trim(), username.trim(), passwordHash, id]
      );
    } else {
      resultado = await pool.query(
        `UPDATE usuarios
         SET nombre = $1, username = $2
         WHERE id = $3
         RETURNING id, nombre, username, creado_en`,
        [nombre.trim(), username.trim(), id]
      );
    }

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    return res.status(200).json({
      mensaje: "Usuario actualizado correctamente",
      usuario: resultado.rows[0]
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "El username ya está registrado"
      });
    }

    console.error("Error al actualizar usuario:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

/* DELETE - Eliminar usuario por ID */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        error: "El ID debe ser un entero positivo"
      });
    }

    const resultado = await pool.query(
      `DELETE FROM usuarios
       WHERE id = $1
       RETURNING id, nombre, username`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    return res.status(200).json({
      mensaje: "Usuario eliminado correctamente",
      usuario: resultado.rows[0]
    });

  } catch (error) {
    console.error("Error al eliminar usuario:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});


module.exports = router;
