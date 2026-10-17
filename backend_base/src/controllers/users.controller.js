const fs = require("fs");
const path = require("path");

// Ruta exacta hacia tu archivo JSON
const dbPath = path.join(__dirname, "../database/users.json");

// Funciones auxiliares para leer y escribir en el JSON
const readDB = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

const getUsers = (req, res) => {
    const users = readDB();
    res.status(200).json(users);
};

const createUser = (req, res) => {
    const users = readDB();
    const newUser = req.body;
    // Asignar un ID automático sumando 1 al último ID
    newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    users.push(newUser);
    writeDB(users);
    res.status(201).json(newUser);
};

const updateUser = (req, res) => {
    const users = readDB();
    const { id } = req.params;
    const index = users.findIndex(u => u.id === parseInt(id));

    if (index === -1) return res.status(404).json({ message: "Usuario no encontrado" });

    // Actualiza los datos manteniendo el mismo ID
    users[index] = { ...users[index], ...req.body, id: parseInt(id) };
    writeDB(users);
    res.status(200).json(users[index]);
};

const deleteUser = (req, res) => {
    const users = readDB();
    const { id } = req.params;
    const filteredUsers = users.filter(u => u.id !== parseInt(id));

    if (users.length === filteredUsers.length) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    writeDB(filteredUsers);
    res.status(200).json({ message: "Usuario eliminado correctamente" });
};

module.exports = { getUsers, createUser, updateUser, deleteUser };