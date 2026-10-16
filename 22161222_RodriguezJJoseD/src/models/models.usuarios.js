const fs = require('fs'); // Esta variable es para poder leer archivos
const path = require('path');  // Esta variable es para manipular las rutas de los archivos

const file = path.join(__dirname, '../database/Usuarios.JSON');

const obtenerUsuarios = () => {
    try {
        const datos = fs.readFileSync(file, 'utf-8');
        return JSON.parse(datos);
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        throw error;
    }
}

const guardarUsuario = (datosUsuario) => {
    try {
        // NULL es un valor de relleno, 2 es para que tenga sangria y sea mas legible.
        fs.writeFileSync(file, JSON.stringify(datosUsuario, null, 2));
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        throw error;
    }
}

const crearUsuario = (nombre, username, contrasenia) => {
    try {
        const usuarios = obtenerUsuarios();

        // Validamos si el username ya está registrado por otro usuario
        const existeUsername = usuarios.some(u => u.username.toLowerCase() === username.toLowerCase());
        if (existeUsername) {
            return 'USERNAME_DUPLICADO';
        }

        const nuevoId = usuarios.length > 0
            ? Math.max(...usuarios.map(u => Number(u.ID))) + 1
            : 1;

        // Creamos el objeto nuevoUsuario con la clave ID 
        const nuevoUsuario = {
            ID: Number(nuevoId),
            nombre,
            username,
            contrasenia
        };
        // Agregamos el nuevo usuario a la lista
        usuarios.push(nuevoUsuario);
        // Guardamos la lista en el archivo
        guardarUsuario(usuarios);
        return nuevoUsuario;
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
}

const actualizarUsuario = (idUsuario, datosUsuario) => {
    try {
        // Traemos la info de los usuarios desde el archivo
        const usuarios = obtenerUsuarios();

        // Buscamos el indice del usuario a actualizar
        const indiceUsuario = usuarios.findIndex(usuario => usuario.ID == idUsuario);

        // Si el usuario no existe que devuelva null
        if (indiceUsuario === -1) {
            return null;
        }

        // Validamos si otro usuario (distinto a este) ya tiene el mismo username
        const existeUsername = usuarios.some(
            usuario => usuario.ID != idUsuario && usuario.username.toLowerCase() === datosUsuario.username.toLowerCase()
        );
        if (existeUsername) {
            return 'USERNAME_DUPLICADO';
        }

        // Agregamos los datos actualizados dentro de nuestro arreglo de usuarios
        usuarios[indiceUsuario] = datosUsuario;

        // Guardamos los datos actualizados en el archivo
        guardarUsuario(usuarios);

        // Devolvemos el usuario actualizado
        return usuarios[indiceUsuario];
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    }
}

const eliminarUsuario = (idUsuario) => {
    try {
        //Traemos la info de los usuarios desde el archivo
        const usuarios = obtenerUsuarios();
        // Buscamos el indice del usuario a eliminar
        const indiceUsuario = usuarios.findIndex(usuario => usuario.ID == idUsuario);

        // Si el usuario no existe que devuelva null
        if (indiceUsuario === -1) {
            return null;
        } else {
            //Eliminamos al usuario
            const [usuarioEliminado] = usuarios.splice(indiceUsuario, 1);
            //Guardamos los datos
            guardarUsuario(usuarios);
            //Devolvemos al usuario eliminado
            return usuarioEliminado;
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw error;
    }
}


module.exports = {
    obtenerUsuarios,
    guardarUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};