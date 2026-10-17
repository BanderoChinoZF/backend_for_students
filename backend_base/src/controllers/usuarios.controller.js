const {Request, Response} = require('express');
const {leerDatos, escribirDatos, generarId} = require('../utils/fileReadHandler');

//============================================================
//GET /api/v1/usuarios -> Listar todos los usuarios
//============================================================
const getUsuarios = (req = Request, res = Response) => {
  const usuarios = leerDatos();
  res.json({
    total: usuarios.length,
    data: usuarios,
  });
};

//============================================================
//GET /api/v1/usuarios/:id -> Obtener un usuario por ID
//============================================================
const getUsuarioById = (req = Request, res = Response) => {
  const id = parseInt(req.params.id);
  const usuarios = leerDatos();
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return res.status(404).json({
      status: "error",
      message: `Usuario con id ${id} no encontrado`,
    });
  }

  res.json(usuario);
};

//============================================================
//POST /api/v1/usuarios -> Crear un nuevo usuario
//============================================================
const crearUsuario = (req = Request, res = Response) => {
    const {nombre, email, edad, username, password} = req.body;

    //validacion de los campos obligatorios
    if (!nombre || !email || !edad || !username || !password) {
        return res.status(400).json({
            status: "error",
            message: "Todos los campos son obligatorios",
        });
    }

    const usuarios = leerDatos();

    if(usuarios.some(u => u.email === email)) {

        return res.status(400).json({
            status: "error",
            message: "El email ya está registrado",
        });
    }

    const nuevoUsuario = {
        id: generarId(usuarios),
        nombre:nombre.trim(),
        email:email.trim(),
        edad:parseInt(edad) || null,
        username:username.trim(),
        password:password.trim()
    };

    usuarios.push(nuevoUsuario);
    
    if(!escribirDatos(usuarios)) {
        return res.status(500).json({
            status: "error",
            message: "Error al guardar el usuario",
        });
    }

    res.status(201).json({
        status: "success",
        message: "Usuario creado exitosamente",
        data: nuevoUsuario
    });
};

//============================================================
//PUT /api/v1/usuarios/:id -> Actualizar un usuario por ID
//============================================================
const actualizarUsuario = (req = Request, res = Response) => {
    const id = parseInt(req.params.id);
    const {nombre, email, edad} = req.body;

    const usuarios = leerDatos();
    //buscamos el usuario por id en el arreglo de objetos JSON y obtenemos su índice
    const usuarioIndex = usuarios.findIndex((u) => u.id === id);

    //retornamos un error si el usuario no existe (404) y una respuesta en formato JSON con el mensaje de error
    if(usuarioIndex === -1) {
        return res.status(404).json({
            status: "error",
            message: `Usuario con id ${id} no encontrado`,
        });
    }

    if(email && usuarios.some(u => u.email === email && u.id !== id)) {
        return res.status(400).json({
            status: "error",
            message: "El email ya está registrado por otro usuario",
        });
    }

    usuarios[usuarioIndex] = {
        ...usuarios[usuarioIndex],
        //utilizacion de if ternario para validar si el campo es nulo o undefined, en caso de serlo se mantiene el valor anterior del usuario
        nombre: nombre ? nombre.trim() : usuarios[usuarioIndex].nombre,
        email: email ? email.trim() : usuarios[usuarioIndex].email,
        edad: edad ? parseInt(edad) : usuarios[usuarioIndex].edad
    };

    escribirDatos(usuarios);

    res.json({
        status: "success",
        message: "Usuario actualizado exitosamente",
        data: usuarios[usuarioIndex]
    });
};

//============================================================
//DELETE /api/v1/usuarios/:id -> Eliminar un usuario por ID
//============================================================
const eliminarUsuario = (req = Request, res = Response) => {
    const id = parseInt(req.params.id);
    const usuarios = leerDatos();
    const usuarioIndex = usuarios.findIndex((u) => u.id === id);

    if(usuarioIndex === -1) {
        return res.status(404).json({
            status: "error",
            message: `Usuario con id ${id} no encontrado`,
        });
    }

    const usuarioEliminado = usuarios.splice(usuarioIndex, 1)[0];
    escribirDatos(usuarios);

    res.json({
        status: "success",
        message: "Usuario eliminado exitosamente",
        data: usuarioEliminado
    });
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};

