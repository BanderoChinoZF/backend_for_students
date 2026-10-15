const pool = require("../config/database");

async function obtenerTodos() {
  const resultado = await pool.query(
    "SELECT id, nombre, username FROM usuarios ORDER BY id"
  );

  return resultado.rows;
}

async function obtenerPorId(id) {
  const resultado = await pool.query(
    "SELECT id, nombre, username FROM usuarios WHERE id = $1",
    [Number(id)]
  );

  return resultado.rows[0];
}

async function crear(datos) {
  const resultado = await pool.query(
    `INSERT INTO usuarios (nombre, username, contrasena)
     VALUES ($1, $2, $3)
     RETURNING id, nombre, username`,
    [datos.nombre, datos.username, datos.contrasena]
  );

  return resultado.rows[0];
}

async function actualizar(id, datos) {
  const camposPermitidos = ["nombre", "username", "contrasena"];
  const campos = Object.keys(datos).filter(
    (campo) => camposPermitidos.includes(campo)
  );

  if (campos.length === 0) {
    return obtenerPorId(id);
  }

  const valores = campos.map((campo) => datos[campo]);
  const asignaciones = campos.map(
    (campo, indice) => `${campo} = $${indice + 1}`
  );

  valores.push(Number(id));

  const resultado = await pool.query(
    `UPDATE usuarios
     SET ${asignaciones.join(", ")}
     WHERE id = $${valores.length}
     RETURNING id, nombre, username`,
    valores
  );

  return resultado.rows[0];
}

async function eliminar(id) {
  const resultado = await pool.query(
    `DELETE FROM usuarios
     WHERE id = $1
     RETURNING id, nombre, username`,
    [Number(id)]
  );

  return resultado.rows[0];
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
