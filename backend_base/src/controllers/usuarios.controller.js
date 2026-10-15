const usuariosService = require("../services/usuarios.service");

const camposPermitidos = ["nombre", "username", "contrasena"];

function seleccionarCampos(datos) {
  const resultado = {};

  for (const campo of camposPermitidos) {
    if (datos[campo] !== undefined) {
      resultado[campo] = datos[campo];
    }
  }

  return resultado;
}

function validarCampos(datos, obligatorios) {
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return "El cuerpo debe ser un objeto JSON.";
  }

  for (const campo of obligatorios) {
    if (
      typeof datos[campo] !== "string" ||
      datos[campo].trim() === ""
    ) {
      return `El campo '${campo}' es obligatorio y debe ser texto.`;
    }
  }

  return null;
}

async function listar(req, res, next) {
  try {
    const usuarios = await usuariosService.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

async function buscar(req, res, next) {
  try {
    const usuario = await usuariosService.obtenerPorId(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const errorValidacion = validarCampos(
      req.body,
      camposPermitidos
    );

    if (errorValidacion) {
      return res.status(400).json({ error: errorValidacion });
    }

    const datos = seleccionarCampos(req.body);
    const existente = (await usuariosService.obtenerTodos()).some(
      (usuario) => usuario.username === datos.username
    );

    if (existente) {
      return res.status(409).json({
        error: "El username ya está registrado",
      });
    }

    const usuario = await usuariosService.crear(datos);
    res.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const datos = seleccionarCampos(req.body);
    const campos = Object.keys(datos);

    if (campos.length === 0) {
      return res.status(400).json({
        error: "Envía al menos un campo válido para actualizar",
      });
    }

    const errorValidacion = validarCampos(datos, campos);

    if (errorValidacion) {
      return res.status(400).json({ error: errorValidacion });
    }

    const usuarios = await usuariosService.obtenerTodos();
    const conflicto = usuarios.some(
      (usuario) =>
        usuario.username === datos.username &&
        usuario.id !== Number(req.params.id)
    );

    if (datos.username && conflicto) {
      return res.status(409).json({
        error: "El username ya está registrado",
      });
    }

    const usuario = await usuariosService.actualizar(
      req.params.id,
      datos
    );

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    const usuario = await usuariosService.eliminar(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      message: "Usuario eliminado correctamente",
      usuario,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  buscar,
  crear,
  actualizar,
  eliminar,
};
