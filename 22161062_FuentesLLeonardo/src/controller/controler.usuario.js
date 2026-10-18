const fs = require("fs");
const path = require("path");

// Ruta hacia el diccionario JSON en la carpeta database
const dbPath = path.join(__dirname, "../database/usuarios.json");

// Función auxiliar para leer el archivo JSON
const leerDiccionario = () => {
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo de usuarios:", error.message);
    return [];
  }
};

// Función auxiliar para guardar los cambios en el archivo JSON
const guardarDiccionario = (datos) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(datos, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error al guardar en el archivo:", error.message);
    return false;
  }
};

// Función auxiliar para autogenerar el siguiente ID
const generarId = (usuarios) => {
  if (!usuarios || usuarios.length === 0) return 1;
  const ids = usuarios.map((u) => Number(u.id)).filter((id) => !isNaN(id));
  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
};

// 1. GET - Obtener todos los usuarios (con total y data)
const obtenerUsuarios = (req, res) => {
  const usuarios = leerDiccionario();
  res.status(200).json({
    total: usuarios.length,
    data: usuarios,
  });
};

// 2. GET - Obtener un usuario por ID o username
const obtenerUsuarioPorId = (req, res) => {
  const param = req.params.id;
  const numId = parseInt(param);
  const usuarios = leerDiccionario();

  const usuario = usuarios.find(
    (u) => (!isNaN(numId) && u.id === numId) || u.username === param
  );

  if (!usuario) {
    return res.status(404).json({
      status: "error",
      message: `Usuario con id o username "${param}" no encontrado`,
    });
  }

  res.status(200).json(usuario);
};

// 3. POST - Crear y guardar un usuario nuevo
const crearUsuario = (req, res) => {
  const { nombre, email, edad, username, password, contrasena } = req.body;
  const clave = password || contrasena;

  if (!nombre || !username || !clave) {
    return res.status(400).json({
      status: "error",
      message: "Los campos nombre, username y password/contrasena son obligatorios",
    });
  }

  const usuarios = leerDiccionario();

  if (email && usuarios.some((u) => u.email && u.email === email)) {
    return res.status(400).json({
      status: "error",
      message: "El email ya está registrado",
    });
  }

  if (usuarios.some((u) => u.username === username)) {
    return res.status(400).json({
      status: "error",
      message: "El username ya se encuentra registrado",
    });
  }

  const nuevoUsuario = {
    id: generarId(usuarios),
    nombre: nombre.trim(),
    email: email ? email.trim() : "",
    edad: edad ? parseInt(edad) : null,
    username: username.trim(),
    password: clave.trim(),
  };

  usuarios.push(nuevoUsuario);
  guardarDiccionario(usuarios);

  res.status(201).json({
    status: "success",
    message: "Usuario creado exitosamente",
    data: nuevoUsuario,
  });
};

// 4. PUT - Actualizar un usuario existente por su ID o username
const actualizarUsuario = (req, res) => {
  const param = req.params.id;
  const numId = parseInt(param);
  const { nombre, email, edad, password, contrasena } = req.body;
  const clave = password || contrasena;

  const usuarios = leerDiccionario();
  const index = usuarios.findIndex(
    (u) => (!isNaN(numId) && u.id === numId) || u.username === param
  );

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Usuario con id o username "${param}" no encontrado`,
    });
  }

  if (email && usuarios.some((u) => u.email === email && u.id !== usuarios[index].id)) {
    return res.status(400).json({
      status: "error",
      message: "El email ya está registrado por otro usuario",
    });
  }

  usuarios[index] = {
    ...usuarios[index],
    nombre: nombre ? nombre.trim() : usuarios[index].nombre,
    email: email ? email.trim() : usuarios[index].email,
    edad: edad !== undefined ? parseInt(edad) : usuarios[index].edad,
    password: clave ? clave.trim() : usuarios[index].password,
  };

  guardarDiccionario(usuarios);

  res.status(200).json({
    status: "success",
    message: "Usuario actualizado correctamente",
    data: usuarios[index],
  });
};

// 5. DELETE - Eliminar un usuario por su ID o username
const eliminarUsuario = (req, res) => {
  const param = req.params.id;
  const numId = parseInt(param);
  const usuarios = leerDiccionario();

  const index = usuarios.findIndex(
    (u) => (!isNaN(numId) && u.id === numId) || u.username === param
  );

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Usuario con id o username "${param}" no encontrado`,
    });
  }

  const usuarioEliminado = usuarios.splice(index, 1)[0];
  guardarDiccionario(usuarios);

  res.status(200).json({
    status: "success",
    message: `Usuario con id ${usuarioEliminado.id} (${usuarioEliminado.username}) eliminado correctamente`,
    data: usuarioEliminado,
  });
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
