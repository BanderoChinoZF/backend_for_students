
const express = require("express");
const pool = require("../database/db");

const router = express.Router();

// POST - Registrar un contacto
router.post("/", async (req, res) => {
  try {
    const { usuario_id, telefono, correo } = req.body;

    if (
      !Number.isSafeInteger(usuario_id) ||
      usuario_id <= 0 ||
      typeof telefono !== "string" ||
      !telefono.trim() ||
      telefono.length > 20 ||
      typeof correo !== "string" ||
      !correo.trim() ||
      correo.length > 150
    ) {
      return res.status(400).json({
        error: "Datos del contacto inválidos"
      });
    }

    const resultado = await pool.query(
      `INSERT INTO contactos (usuario_id, telefono, correo)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [usuario_id, telefono.trim(), correo.trim()]
    );

    res.status(201).json({
      mensaje: "Contacto registrado correctamente",
      contacto: resultado.rows[0]
    });

  } catch (error) {
    if (error.code === "23503") {
      return res.status(404).json({
        error: "El usuario indicado no existe"
      });
    }

    console.error("Error al registrar contacto:", error);

    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

/* GET - Consultar todos los contactos con JOIN */
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT
         c.id,
         c.usuario_id,
         u.nombre AS nombre_usuario,
         u.username,
         c.telefono,
         c.correo
       FROM contactos c
       INNER JOIN usuarios u
         ON c.usuario_id = u.id
       ORDER BY c.id ASC`
    );

    return res.status(200).json({
      total: resultado.rows.length,
      contactos: resultado.rows
    });

  } catch (error) {
    console.error("Error al consultar contactos:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

/* GET - Consultar un contacto por ID */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        error: "El ID debe ser un entero positivo"
      });
    }

    const resultado = await pool.query(
      `SELECT
         c.id,
         c.usuario_id,
         u.nombre AS nombre_usuario,
         u.username,
         c.telefono,
         c.correo
       FROM contactos c
       INNER JOIN usuarios u
         ON c.usuario_id = u.id
       WHERE c.id = $1`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Contacto no encontrado"
      });
    }

    return res.status(200).json(resultado.rows[0]);

  } catch (error) {
    console.error("Error al consultar contacto:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});


/* DELETE - Eliminar un contacto por ID */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        error: "El ID debe ser un entero positivo"
      });
    }

    const resultado = await pool.query(
      `DELETE FROM contactos
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Contacto no encontrado"
      });
    }

    return res.status(200).json({
      mensaje: "Contacto eliminado correctamente",
      contacto: resultado.rows[0]
    });

  } catch (error) {
    console.error("Error al eliminar contacto:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

/* PUT - Actualizar un contacto por ID */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id, telefono, correo } = req.body;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        error: "El ID debe ser un entero positivo"
      });
    }

    if (
      !Number.isSafeInteger(usuario_id) ||
      usuario_id <= 0 ||
      typeof telefono !== "string" ||
      !telefono.trim() ||
      telefono.length > 20 ||
      typeof correo !== "string" ||
      !correo.trim() ||
      correo.length > 150
    ) {
      return res.status(400).json({
        error: "Datos del contacto inválidos"
      });
    }

    const resultado = await pool.query(
      `UPDATE contactos
       SET usuario_id = $1,
           telefono = $2,
           correo = $3
       WHERE id = $4
       RETURNING *`,
      [usuario_id, telefono.trim(), correo.trim(), id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Contacto no encontrado"
      });
    }

    return res.status(200).json({
      mensaje: "Contacto actualizado correctamente",
      contacto: resultado.rows[0]
    });

  } catch (error) {
    if (error.code === "23503") {
      return res.status(404).json({
        error: "El usuario indicado no existe"
      });
    }

    console.error("Error al actualizar contacto:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

module.exports = router;
