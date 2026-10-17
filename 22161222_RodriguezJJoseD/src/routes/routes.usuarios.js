const express = require("express");
const controllerUsuarios = require("../controller/controller.usuarios");
const router = express.Router();


// ruta GET
router.get("/usuarios", controllerUsuarios.getUsuario);

//ruta POST
router.post("/usuarios", controllerUsuarios.postUsuario);

//Metodo PUT
router.put("/usuarios/:id", controllerUsuarios.putUsuario);

//Metodo DELETE
router.delete("/usuarios/:id", controllerUsuarios.deleteUsuario);

module.exports = router;