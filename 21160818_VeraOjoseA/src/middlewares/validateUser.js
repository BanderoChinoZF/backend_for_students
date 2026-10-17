// src/middlewares/validateUser.js
const CAMPOS = ["nombre", "username", "password"];

const esTextoValido = (valor) => typeof valor === "string" && valor.trim() !== "";

// POST: los 3 campos son obligatorios
const validateCreate = (req, res, next) => {
  const faltantes = CAMPOS.filter((campo) => !esTextoValido(req.body?.[campo]));

  if (faltantes.length > 0) {
    return res.status(400).json({ error: "Faltan campos o están vacíos", campos: faltantes });
  }
  next();
};

// PUT: al menos un campo, y los que vengan no pueden ir vacíos
const validateUpdate = (req, res, next) => {
  const enviados = CAMPOS.filter((campo) => req.body?.[campo] !== undefined);

  if (enviados.length === 0) {
    return res.status(400).json({ error: "Envía al menos un campo: nombre, username o password" });
  }

  const invalidos = enviados.filter((campo) => !esTextoValido(req.body[campo]));
  if (invalidos.length > 0) {
    return res.status(400).json({ error: "Campos vacíos o inválidos", campos: invalidos });
  }
  next();
};

module.exports = { validateCreate, validateUpdate };