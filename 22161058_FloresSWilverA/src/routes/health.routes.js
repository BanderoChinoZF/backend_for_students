// src/routes/health.routes.js

const express = require("express");
const env = require("../config/env");

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
 *                   example: First Microservice - Backend for Students
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-10-19T18:00:00.000Z"
 */
router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: env.serviceName,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;