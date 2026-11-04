const express = require("express");
const router = express.Router();
const {
  getUsuarios,
  getUsuarioById,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require("../controllers/usuarios.db.controller");

//Los esquemas UsuarioEntrada, UsuarioActualizacion y RespuestaError estan en usuarios.routes.js

/**
 * @swagger
 * components:
 *   schemas:
 *     UsuarioDb:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: Ana Gonzales
 *         email:
 *           type: string
 *           format: email
 *           example: anita99@gmail.com
 *         edad:
 *           type: integer
 *           example: 28
 *         username:
 *           type: string
 *           example: anita99
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-10-27T18:00:00.000Z"
 *     RespuestaUsuarioDb:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Usuario creado exitosamente
 *         data:
 *           $ref: '#/components/schemas/UsuarioDb'
 *     RespuestaUsuariosDb:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 2
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UsuarioDb'
 */

/**
 * @swagger
 * /api/v1/db/usuarios:
 *   get:
 *     operationId: getUsuariosDb
 *     summary: Obtener todos los usuarios desde Supabase
 *     description: Consulta la tabla usuarios de Supabase (PostgreSQL). No regresa el password.
 *     tags:
 *       - Usuarios (Supabase)
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaUsuariosDb'
 *       500:
 *         description: Error en la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 */
router.get("/", getUsuarios);

/**
 * @swagger
 * /api/v1/db/usuarios/{id}:
 *   get:
 *     operationId: getUsuarioByIdDb
 *     summary: Obtener un usuario por ID desde Supabase
 *     tags:
 *       - Usuarios (Supabase)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identificador numérico del usuario.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioDb'
 *       404:
 *         description: No existe un usuario con el ID indicado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 */
router.get("/:id", getUsuarioById);

/**
 * @swagger
 * /api/v1/db/usuarios:
 *   post:
 *     operationId: crearUsuarioDb
 *     summary: Crear un usuario en Supabase
 *     description: Inserta un usuario nuevo en la tabla usuarios. Todos los campos son obligatorios.
 *     tags:
 *       - Usuarios (Supabase)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioEntrada'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaUsuarioDb'
 *       400:
 *         description: Faltan campos obligatorios o el email ya está registrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 */
router.post("/", crearUsuario);

/**
 * @swagger
 * /api/v1/db/usuarios/{id}:
 *   put:
 *     operationId: actualizarUsuarioDb
 *     summary: Actualizar un usuario en Supabase
 *     description: Actualiza nombre, email o edad. Solo se cambian los campos que se envían.
 *     tags:
 *       - Usuarios (Supabase)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identificador numérico del usuario.
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioActualizacion'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaUsuarioDb'
 *       400:
 *         description: El email ya está registrado por otro usuario.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 *       404:
 *         description: No existe un usuario con el ID indicado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 */
router.put("/:id", actualizarUsuario);

/**
 * @swagger
 * /api/v1/db/usuarios/{id}:
 *   delete:
 *     operationId: eliminarUsuarioDb
 *     summary: Eliminar un usuario de Supabase
 *     tags:
 *       - Usuarios (Supabase)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identificador numérico del usuario.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaUsuarioDb'
 *       404:
 *         description: No existe un usuario con el ID indicado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 */
router.delete("/:id", eliminarUsuario);

module.exports = router;
