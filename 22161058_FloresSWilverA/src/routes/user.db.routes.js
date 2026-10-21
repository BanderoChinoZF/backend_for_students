// src/routes/user.db.routes.jd
// Rutas documentadas con Swagger para manipular la tabla de usuarios

const express = require("express");
const userDbController = require("../controllers/user.db.controller");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDb:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Wilver Flores
 *         email:
 *           type: string
 *           format: email
 *           example: wilver@example.com
 *         username:
 *           type: string
 *           example: wilver
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-10-21T18:00:00.000Z"
 *     UserDbInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - username
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           format: email
 *           example: juan@example.com
 *         username:
 *           type: string
 *           example: jperez
 *         password:
 *           type: string
 *           example: "miPassword123"
 */

/**
 * @swagger
 * /api/v1/db/users:
 *   get:
 *     summary: Obtener usuarios desde Supabase (PostgreSQL)
 *     tags:
 *       - Users (Database)
 *     responses:
 *       200:
 *         description: Lista de usuarios de la base de datos
 */
router.get("/", userDbController.getUsers);

/**
 * @swagger
 * /api/v1/db/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID desde Supabase
 *     tags:
 *       - Users (Database)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", userDbController.getUserById);

/**
 * @swagger
 * /api/v1/db/users:
 *   post:
 *     summary: Crear usuario en Supabase (PostgreSQL)
 *     tags:
 *       - Users (Database)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDbInput'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
router.post("/", userDbController.createUser);

/**
 * @swagger
 * /api/v1/db/users/{id}:
 *   put:
 *     summary: Actualizar usuario en Supabase
 *     tags:
 *       - Users (Database)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDbInput'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put("/:id", userDbController.updateUser);

/**
 * @swagger
 * /api/v1/db/users/{id}:
 *   delete:
 *     summary: Eliminar usuario de Supabase
 *     tags:
 *       - Users (Database)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete("/:id", userDbController.deleteUser);

module.exports = router;