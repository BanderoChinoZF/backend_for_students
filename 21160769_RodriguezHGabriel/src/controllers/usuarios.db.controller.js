const {Request, Response} = require('express');
const usuariosDb = require('../services/usuarios.db.service');

//Respuesta generica cuando la base de datos falla
const errorServidor = (res, error) => {
    console.error('Error en Supabase:', error.message);
    return res.status(500).json({
        status: "error",
        message: "Error en la base de datos",
    });
};

//============================================================
//GET /api/v1/db/usuarios -> Listar todos los usuarios de Supabase
//============================================================
const getUsuarios = async (req = Request, res = Response) => {
    try {
        const usuarios = await usuariosDb.obtenerUsuarios();
        res.json({
            total: usuarios.length,
            data: usuarios,
        });
    } catch (error) {
        errorServidor(res, error);
    }
};

//============================================================
//GET /api/v1/db/usuarios/:id -> Obtener un usuario por ID
//============================================================
const getUsuarioById = async (req = Request, res = Response) => {
    const id = parseInt(req.params.id);
    try {
        const usuario = await usuariosDb.obtenerUsuarioPorId(id);

        if (!usuario) {
            return res.status(404).json({
                status: "error",
                message: `Usuario con id ${id} no encontrado`,
            });
        }

        res.json(usuario);
    } catch (error) {
        errorServidor(res, error);
    }
};

//============================================================
//POST /api/v1/db/usuarios -> Crear un nuevo usuario
//============================================================
const crearUsuario = async (req = Request, res = Response) => {
    const {nombre, email, edad, username, password} = req.body;

    //validacion de los campos obligatorios
    if (!nombre || !email || !edad || !username || !password) {
        return res.status(400).json({
            status: "error",
            message: "Todos los campos son obligatorios",
        });
    }

    try {
        if (await usuariosDb.emailRegistrado(email.trim())) {
            return res.status(400).json({
                status: "error",
                message: "El email ya está registrado",
            });
        }

        const nuevoUsuario = await usuariosDb.crearUsuario({
            nombre: nombre.trim(),
            email: email.trim(),
            edad: parseInt(edad) || null,
            username: username.trim(),
            password: password.trim()
        });

        res.status(201).json({
            status: "success",
            message: "Usuario creado exitosamente",
            data: nuevoUsuario
        });
    } catch (error) {
        errorServidor(res, error);
    }
};

//============================================================
//PUT /api/v1/db/usuarios/:id -> Actualizar un usuario por ID
//============================================================
const actualizarUsuario = async (req = Request, res = Response) => {
    const id = parseInt(req.params.id);
    const {nombre, email, edad} = req.body;

    //solo actualizamos los campos que vienen en el body
    const cambios = {};
    if (nombre) cambios.nombre = nombre.trim();
    if (email) cambios.email = email.trim();
    if (edad) cambios.edad = parseInt(edad);

    try {
        if (!(await usuariosDb.obtenerUsuarioPorId(id))) {
            return res.status(404).json({
                status: "error",
                message: `Usuario con id ${id} no encontrado`,
            });
        }

        if (cambios.email && await usuariosDb.emailRegistrado(cambios.email, id)) {
            return res.status(400).json({
                status: "error",
                message: "El email ya está registrado por otro usuario",
            });
        }

        const usuarioActualizado = Object.keys(cambios).length > 0
            ? await usuariosDb.actualizarUsuario(id, cambios)
            : await usuariosDb.obtenerUsuarioPorId(id);

        res.json({
            status: "success",
            message: "Usuario actualizado exitosamente",
            data: usuarioActualizado
        });
    } catch (error) {
        errorServidor(res, error);
    }
};

//============================================================
//DELETE /api/v1/db/usuarios/:id -> Eliminar un usuario por ID
//============================================================
const eliminarUsuario = async (req = Request, res = Response) => {
    const id = parseInt(req.params.id);

    try {
        const usuarioEliminado = await usuariosDb.eliminarUsuario(id);

        if (!usuarioEliminado) {
            return res.status(404).json({
                status: "error",
                message: `Usuario con id ${id} no encontrado`,
            });
        }

        res.json({
            status: "success",
            message: "Usuario eliminado exitosamente",
            data: usuarioEliminado
        });
    } catch (error) {
        errorServidor(res, error);
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};
