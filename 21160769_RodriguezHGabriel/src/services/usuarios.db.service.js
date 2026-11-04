//Servicio con las consultas a la tabla usuarios de Supabase (PostgreSQL)
const {supabase} = require('../config/db');

const TABLA = 'usuarios';
//No regresamos el password en las respuestas
const COLUMNAS = 'id, nombre, email, edad, username, created_at';

//1. Obtener todos los usuarios
async function obtenerUsuarios() {
    const {data, error} = await supabase.from(TABLA).select(COLUMNAS).order('id');
    if (error) throw error;
    return data;
}

//2. Obtener un usuario por ID (null si no existe)
async function obtenerUsuarioPorId(id) {
    const {data, error} = await supabase.from(TABLA).select(COLUMNAS).eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
}

//3. Saber si un email ya lo tiene otro usuario
async function emailRegistrado(email, idExcluir = 0) {
    const {data, error} = await supabase.from(TABLA).select('id').eq('email', email).neq('id', idExcluir);
    if (error) throw error;
    return data.length > 0;
}

//4. Crear un usuario; el id lo genera PostgreSQL (IDENTITY)
async function crearUsuario(usuario) {
    const {data, error} = await supabase.from(TABLA).insert(usuario).select(COLUMNAS).single();
    if (error) throw error;
    return data;
}

//5. Actualizar solo los campos que vienen (null si no existe)
async function actualizarUsuario(id, cambios) {
    const {data, error} = await supabase.from(TABLA).update(cambios).eq('id', id).select(COLUMNAS).maybeSingle();
    if (error) throw error;
    return data;
}

//6. Eliminar un usuario y regresar el registro eliminado (null si no existe)
async function eliminarUsuario(id) {
    const {data, error} = await supabase.from(TABLA).delete().eq('id', id).select(COLUMNAS);
    if (error) throw error;
    return data[0] || null;
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    emailRegistrado,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};
