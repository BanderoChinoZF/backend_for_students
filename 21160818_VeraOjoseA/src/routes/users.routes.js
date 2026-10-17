// src/routes/users.routes.js
const express = require("express");
const usersController = require("../controllers/users.controller");
const { validateCreate, validateUpdate } = require("../middlewares/validateUser");

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUser);
router.post("/", validateCreate, usersController.createUser);
router.put("/:id", validateUpdate, usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;