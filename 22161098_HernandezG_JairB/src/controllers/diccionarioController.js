const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../database/diccionario.json');

const obtenerDatos = () => {
  if (!fs.existsSync(jsonPath)) return [];
  const data = fs.readFileSync(jsonPath, 'utf-8');
  return JSON.parse(data || '[]');
};

const guardarDatos = (data) => {
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
};

const getAll = (req, res) => {
  try {
    const lista = obtenerDatos();
    res.json({
      total: lista.length,
      data: lista
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
};

const getById = (req, res) => {
  try {
    const lista = obtenerDatos();
    const item = lista.find(d => d.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el dato' });
  }
};

const create = (req, res) => {
  try {
    const lista = obtenerDatos();
    const nuevo = { id: Date.now(), ...req.body };
    lista.push(nuevo);
    guardarDatos(lista);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar' });
  }
};

const update = (req, res) => {
  try {
    let lista = obtenerDatos();
    const index = lista.findIndex(d => d.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'No encontrado' });
    lista[index] = { ...lista[index], ...req.body };
    guardarDatos(lista);
    res.json(lista[index]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

const remove = (req, res) => {
  try {
    let lista = obtenerDatos();
    const filtrado = lista.filter(d => d.id !== parseInt(req.params.id));
    if (lista.length === filtrado.length) return res.status(404).json({ error: 'No encontrado' });
    guardarDatos(filtrado);
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};