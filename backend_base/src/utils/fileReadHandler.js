const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname,'..','database','usuarios.json');

function leerDatos()
{
    try{
        const contenido = fs.readFileSync(DATA_PATH,'utf-8');

        return JSON.parse(contenido);

    }catch(error){
        console.error('Error al leer el archivo de usuario:', error.message);
        return [];
    }

}

function escribirDatos(usuarios)
{
    try{
        const contenido = JSON.stringify(usuarios, null, 2);

        if (contenido === undefined) {
            throw new TypeError('No se pudieron convertir los datos a JSON');
        }

        fs.writeFileSync(DATA_PATH, contenido, 'utf-8');

        return true;

    }catch(error){
        console.error('Error al escribir en el archivo: ', error.message);
        return false;
    }

}

function generarId(usuarios)
{
    if(usuarios.length === 0) return 1;

    return Math.max(...usuarios.map( u => u.id )) + 1;
}

module.exports = {leerDatos, escribirDatos, generarId};