
const express = require("express");
const env = require("../config/env");
const { probarConexion } = require("../config/db");

const router = express.Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Verifica el estado del servicio
 *     description: Devuelve el estado actual del servicio y la fecha y hora de la consulta.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: El servicio está disponible.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - status
 *                 - service
 *                 - timestamp
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 service:
 *                   type: string
 *                   description: Nombre del servicio configurado.
 *                   example: backend-for-students
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-10-17T18:00:00.000Z"
 */
router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: env.serviceName,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /api/v1/health/db:
 *   get:
 *     summary: Verifica la conexión a la base de datos
 *     description: Hace una consulta de prueba a Supabase (PostgreSQL) y devuelve si la conexión está disponible.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: La base de datos responde.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 database:
 *                   type: string
 *                   example: supabase
 *       503:
 *         description: No hay conexión con la base de datos.
 */
router.get("/db", async (req, res) => {
  try {
    await probarConexion();
    res.status(200).json({
      status: "ok",
      database: "supabase",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: "No hay conexión con la base de datos",
      detail: error.message,
    });
  }
});

module.exports = router;
