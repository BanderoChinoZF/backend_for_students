const modeloUsuarios = require('../models/models.usuarios');

//METODO GET
const getUsuario = (req, res) => {
    try {
        const datos = modeloUsuarios.obtenerUsuarios();
        return res.status(200).json(datos);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return res.status(500).json({ error: 'Error al obtener los datos' });
    }
}

// METODO POST
const postUsuario = (req, res) => {
    try {
        const { nombre, username, contrasenia } = req.body;

        // Validación básica de campos requeridos y que no vengan vacíos
        if (!nombre || !username || !contrasenia || !nombre.trim() || !username.trim() || !contrasenia.trim()) {
            return res.status(400).json({ error: 'Todos los campos (nombre, username, contrasenia) son obligatorios' });
        }

        // Aplicamos la funcion de crearUsuario para crear uno nuevo
        const nuevoUsuario = modeloUsuarios.crearUsuario(nombre.trim(), username.trim(), contrasenia.trim());

        // Si el modelo indica que el username ya existe
        if (nuevoUsuario === 'USERNAME_DUPLICADO') {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }

        // Si ocurrió algún otro fallo de creación
        if (!nuevoUsuario) {
            return res.status(400).json({ error: 'No se pudo crear el usuario' });
        }

        // De lo contrario, que señale que el usuario ha sido registrado exitosamente
        return res.status(201).json({
            mensaje: `El usuario ${nombre} ha sido registrado exitosamente.`,
            usuario: nuevoUsuario
        });
    } catch (error) {
        return res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};


//METODO PUT
const putUsuario = (req, res) => {
    try {
        //Recibimos el id de los parametros de la ruta
        const { id } = req.params;

        //Validamos el formato del id antes de procesar
        if (isNaN(id)) {
            return res.status(400).json({ error: 'El ID debe ser un número válido' });
        }

        //Recibimos los datos del usuario desde el body
        const { nombre, username, contrasenia } = req.body;

        // Validación de campos requeridos y que no vengan vacíos
        if (!nombre || !username || !contrasenia || !nombre.trim() || !username.trim() || !contrasenia.trim()) {
            return res.status(400).json({ error: 'Todos los campos (nombre, username, contrasenia) son obligatorios' });
        }

        //Recibimos los datos que han sido actualizados desde el modelo
        const usuarioActualizado = modeloUsuarios.actualizarUsuario(id, { 
            ID: Number(id), 
            nombre: nombre.trim(), 
            username: username.trim(), 
            contrasenia: contrasenia.trim() 
        });

        //Si el username ya lo tiene otro usuario
        if (usuarioActualizado === 'USERNAME_DUPLICADO') {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso por otro registro' });
        }

        //Si el usuario no ha sido encontrado, que marque un error
        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'usuario no encontrado' });
        }

        //De lo contrario, que señale que el usuario ha sido actualizado
        return res.status(200).json({
            mensaje: `El usuario ${nombre} ha sido actualizado exitosamente.`,
            usuario: usuarioActualizado
        });

    } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
}

//METODO DELETE
const deleteUsuario = (req, res) => {
    //Recibimos el id de los parametros de la ruta
    const { id } = req.params;

    //Validamos el formato del id antes de llamar al modelo
    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }

    try {
        //Aplicamos la funcion eliminarUsuario
        const usuarioEliminado = modeloUsuarios.eliminarUsuario(id);

        //Si el usuario no ha sido encontrado, que marque un error
        if (!usuarioEliminado) {
            return res.status(404).json({ error: 'usuario no encontrado' });
        }

        //De lo contrario, que señale que el usuario ha sido eliminado
        return res.status(200).json({
            mensaje: `El usuario ha sido eliminado exitosamente.`,
            usuario: usuarioEliminado
        });
    } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
}

module.exports = {
    getUsuario,
    postUsuario,
    putUsuario,
    deleteUsuario
};