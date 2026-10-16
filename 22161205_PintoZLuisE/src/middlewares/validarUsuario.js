function validarUsuario(req, res, next) {
  const { Username, Password, Nameuser } = req.body || {};
  const errores = [];

  if (typeof Username !== "string" || Username.trim() === "")
    errores.push("Username es obligatorio y debe ser texto");
  if (typeof Password !== "string" || Password.length === 0 || Password.length > 18)
    errores.push("Password es obligatorio y debe tener máximo 18 caracteres");
  if (typeof Nameuser !== "string" || Nameuser.trim() === "")
    errores.push("Nameuser es obligatorio y debe ser texto");

  if (errores.length > 0)
    return res.status(400).json({ error: "BAD_REQUEST", detalles: errores });

  req.body = { Username: Username.trim(), Password, Nameuser: Nameuser.trim() };
  next();
}

module.exports = validarUsuario;
