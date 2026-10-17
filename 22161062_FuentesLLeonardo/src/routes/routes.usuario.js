const express = require("express");
const router = express.Router();

const {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controller/controler.usuario");

// Definición de los endpoints del CRUD
router.get("/", obtenerUsuarios);
router.post("/", crearUsuario);
router.put("/:username", actualizarUsuario);
router.delete("/:username", eliminarUsuario);

module.exports = router;

