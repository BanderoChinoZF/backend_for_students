const express = require("express");
const controller = require("../controllers/usuarios.controller");
const validarUsuario = require("../middlewares/validarUsuario");

const router = express.Router();

router.get("/", controller.getUsuarios);
router.get("/:id", controller.getUsuarioById);
router.post("/", validarUsuario, controller.createUsuario);
router.put("/:id", validarUsuario, controller.updateUsuario);
router.delete("/:id", controller.deleteUsuario);

module.exports = router;
