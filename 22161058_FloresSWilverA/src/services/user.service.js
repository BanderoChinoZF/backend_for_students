// src/servies/user.service.js

const fs = require("fs").promises;
const path = require("path");

// Ruta absoluta al archivo JSON
const filePath = path.join(__dirname, "../database/users.json");

// Función auxiliar para leer el archivo JSON
async function readUsersFromFile() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe o está vacío, retornamos un arreglo vacío
    return [];
  }
}

// Función auxiliar para guardar el arreglo actualizado en el archivo JSON
async function writeUsersToFile(users) {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
}

// 1. Obtener todos los usuarios
async function getAllUsers() {
  return await readUsersFromFile();
}

// 2. Obtener un usuario por ID
async function getUserById(id) {
  const users = await readUsersFromFile();
  return users.find((u) => u.id === Number(id));
}

// 3. Crear un nuevo usuario
async function createUser(userData) {
  const users = await readUsersFromFile();
  
  // Generar un nuevo ID de forma incremental
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  
  const newUser = {
    id: newId,
    name: userData.name,
    username: userData.username,
    password: userData.password,
  };

  users.push(newUser);
  await writeUsersToFile(users);
  return newUser;
}

// 4. Actualizar un usuario existente
async function updateUser(id, updateData) {
  const users = await readUsersFromFile();
  const index = users.findIndex((u) => u.id === Number(id));

  if (index === -1) return null;

  users[index] = {
    ...users[index],
    name: updateData.name !== undefined ? updateData.name : users[index].name,
    username: updateData.username !== undefined ? updateData.username : users[index].username,
    password: updateData.password !== undefined ? updateData.password : users[index].password,
  };

  await writeUsersToFile(users);
  return users[index];
}

// 5. Eliminar un usuario por ID
async function deleteUser(id) {
  const users = await readUsersFromFile();
  const index = users.findIndex((u) => u.id === Number(id));

  if (index === -1) return false;

  users.splice(index, 1);
  await writeUsersToFile(users);
  return true;
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};