// Rutas: definen qué URL y qué método llaman a cada función del controlador
const express = require("express");
const usersController = require("../controllers/users.controller");

const router = express.Router();

router.get("/", usersController.getUsers);           // Leer todos
router.get("/:id", usersController.getUserById);     // Leer uno
router.post("/", usersController.createUser);        // Crear
router.put("/:id", usersController.updateUser);      // Actualizar
router.delete("/:id", usersController.deleteUser);   // Eliminar

module.exports = router;