const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "../database/users.json");

async function readUsers() {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

async function writeUsers(users) {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}

// GET /users
async function getAll(req, res) {
  const users = await readUsers();
  res.status(200).json(users);
}

// GET /users/:id
async function getById(req, res) {
  const users = await readUsers();
  const user = users.find((u) => u.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({ error: "NOT_FOUND", message: "User not found" });
  }
  res.status(200).json(user);
}

// POST /users
async function create(req, res) {
  const { nombre, username, password } = req.body || {};

  if (!nombre || !username || !password) {
    return res.status(400).json({
      error: "BAD_REQUEST",
      message: "nombre, username and password are required",
    });
  }

  const users = await readUsers();

  if (users.some((u) => u.username === username)) {
    return res.status(409).json({ error: "CONFLICT", message: "Username already exists" });
  }

  const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const newUser = { id, nombre, username, password };

  users.push(newUser);
  await writeUsers(users);
  res.status(201).json(newUser);
}

// PUT /users/:id
async function update(req, res) {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "NOT_FOUND", message: "User not found" });
  }

  const { nombre, username, password } = req.body || {};
  users[index] = {
    ...users[index],
    ...(nombre && { nombre }),
    ...(username && { username }),
    ...(password && { password }),
  };

  await writeUsers(users);
  res.status(200).json(users[index]);
}

// DELETE /users/:id
async function remove(req, res) {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "NOT_FOUND", message: "User not found" });
  }

  const [deleted] = users.splice(index, 1);
  await writeUsers(users);
  res.status(200).json({ message: "User deleted", user: deleted });
}

module.exports = { getAll, getById, create, update, remove };
