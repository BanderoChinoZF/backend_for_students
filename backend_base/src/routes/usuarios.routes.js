const express = require("express");
const router = express.Router();
const { 
  getUsuarios, 
  getUsuarioById, 
  crearUsuario,  
  actualizarUsuario,
  eliminarUsuario
} = require("../controllers/usuarios.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - id
 *         - nombre
 *         - email
 *         - edad
 *         - username
 *         - password
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
 *           example: ana@example.com
 *         edad:
 *           type: integer
 *           example: 28
 *         username:
 *           type: string
 *           example: ana28
 *         password:
 *           type: string
 *           example: "********"
 *     UsuarioEntrada:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - edad
 *         - username
 *         - password
 *       properties:
 *         nombre:
 *           type: string
 *           example: Ana Gonzales
 *         email:
 *           type: string
 *           format: email
 *           example: ana@example.com
 *         edad:
 *           type: integer
 *           example: 28
 *         username:
 *           type: string
 *           example: ana28
 *         password:
 *           type: string
 *           format: password
 *           example: "********"
 *     UsuarioActualizacion:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         nombre:
 *           type: string
 *           example: Ana Gonzales
 *         email:
 *           type: string
 *           format: email
 *           example: ana@example.com
 *         edad:
 *           type: integer
 *           example: 29
 *     RespuestaError:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Usuario no encontrado
 *     RespuestaUsuario:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Usuario creado exitosamente
 *         data:
 *           $ref: '#/components/schemas/Usuario'
 *     RespuestaUsuarios:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 1
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Usuario'
 */

/**
 * @swagger
 * /api/v1/usuarios:
 *   get:
 *     operationId: getUsuarios
 *     summary: Obtener todos los usuarios
 *     description: Devuelve la lista completa de usuarios registrados.
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaUsuarios'
 */
router.get("/", getUsuarios);

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   get:
 *     operationId: getUsuarioById
 *     summary: Obtener un usuario por ID
 *     description: Busca y devuelve un usuario según su identificador.
 *     tags:
 *       - Usuarios
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
 *               $ref: '#/components/schemas/Usuario'
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
 * /api/v1/usuarios:
 *   post:
 *     operationId: crearUsuario
 *     summary: Crear un usuario
 *     description: Registra un usuario nuevo. Todos los campos son obligatorios.
 *     tags:
 *       - Usuarios
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
 *               $ref: '#/components/schemas/RespuestaUsuario'
 *       400:
 *         description: Faltan campos obligatorios o el email ya está registrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 *       500:
 *         description: No se pudo guardar el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 */
router.post("/", crearUsuario);

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   put:
 *     operationId: actualizarUsuario
 *     summary: Actualizar un usuario
 *     description: Actualiza nombre, email o edad del usuario indicado. Los campos son opcionales.
 *     tags:
 *       - Usuarios
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
 *               $ref: '#/components/schemas/RespuestaUsuario'
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
 * /api/v1/usuarios/{id}:
 *   delete:
 *     operationId: eliminarUsuario
 *     summary: Eliminar un usuario
 *     description: Elimina el usuario indicado y devuelve el registro eliminado.
 *     tags:
 *       - Usuarios
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
 *               $ref: '#/components/schemas/RespuestaUsuario'
 *       404:
 *         description: No existe un usuario con el ID indicado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 */
router.delete("/:id", eliminarUsuario);

module.exports = router;
