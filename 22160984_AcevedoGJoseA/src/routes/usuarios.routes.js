const express = require("express");
const usuariosController = require("../controllers/usuarios.controller");

const router = express.Router();


//obtner todos los usuarios
router.get("/", usuariosController.getUsuarios);

//obtener un usuario por su id
router.get("/:id", usuariosController.getUsuarioById);

//crear un nuevo usuario
router.post("/", usuariosController.createUsuario);

//actualizar usuario por su id
router.put("/:id", usuariosController.updateUsuario);

//eliminar usuario por su id
router.delete("/:id", usuariosController.deleteUsuario);

module.exports = router;
