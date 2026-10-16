const fs = require("fs");
const path = require("path");

// Ruta hacia el diccionario JSON en la carpeta database
const dbPath = path.join(__dirname, "../database/usuarios.json");

// Función auxiliar para leer el archivo JSON
const leerDiccionario = () => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

// Función auxiliar para guardar los cambios en el archivo JSON
const guardarDiccionario = (datos) => {
  fs.writeFileSync(dbPath, JSON.stringify(datos, null, 2), "utf-8");
};

// 1. GET 
const obtenerUsuarios = (req, res) => {
  const usuarios = leerDiccionario();
  res.status(200).json({
    status: "ok",
    data: usuarios,
  });
};

// 2. POST 
const crearUsuario = (req, res) => {
  const { nombre, username, contrasena } = req.body;

  if (!nombre || !username || !contrasena) {
    return res.status(400).json({
      status: "error",
      message: "Los campos nombre, username y contrasena son obligatorios",
    });
  }

  const usuarios = leerDiccionario();
  const existe = usuarios.find((u) => u.username === username);

  if (existe) {
    return res.status(400).json({
      status: "error",
      message: "El username ya se encuentra registrado",
    });
  }

  const nuevoUsuario = { nombre, username, contrasena };
  usuarios.push(nuevoUsuario);
  guardarDiccionario(usuarios);

  res.status(201).json({
    status: "ok",
    message: "Usuario guardado correctamente",
    data: nuevoUsuario,
  });
};

// 3. PUT 
const actualizarUsuario = (req, res) => {
  const { username } = req.params;
  const { nombre, contrasena } = req.body;

  const usuarios = leerDiccionario();
  const index = usuarios.findIndex((u) => u.username === username);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Usuario no encontrado",
    });
  }

  if (nombre) usuarios[index].nombre = nombre;
  if (contrasena) usuarios[index].contrasena = contrasena;

  guardarDiccionario(usuarios);

  res.status(200).json({
    status: "ok",
    message: "Usuario actualizado correctamente",
    data: usuarios[index],
  });
};

// 4. DELETE 
const eliminarUsuario = (req, res) => {
  const { username } = req.params;
  const usuarios = leerDiccionario();

  const nuevosUsuarios = usuarios.filter((u) => u.username !== username);

  if (usuarios.length === nuevosUsuarios.length) {
    return res.status(404).json({
      status: "error",
      message: "Usuario no encontrado",
    });
  }

  guardarDiccionario(nuevosUsuarios);

  res.status(200).json({
    status: "ok",
    message: `Usuario ${username} eliminado correctamente`,
  });
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};

