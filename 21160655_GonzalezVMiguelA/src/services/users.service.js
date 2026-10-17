
function getUsersCollection(db) {
  return db.collection("usuarios");
}

async function getNextUserId(db) {
  const counters = db.collection("contadores");

  const result = await counters.findOneAndUpdate(
    { _id: "id_usuario" },
    { $inc: { sequence_value: 1 } },
    {
      upsert: true,
      returnDocument: "after",
      includeResultMetadata: false,
    }
  );

  return `USER-${result.sequence_value}`;
}

async function createUser(db, userData) {
  const collection = getUsersCollection(db);

  const user = {
    id_usuario: await getNextUserId(db),
    nombre_usuario: userData.nombre_usuario,
    username: userData.username,
    password: userData.password,
  };

  await collection.insertOne(user);
  return user;
}

async function getAllUsers(db) {
  return getUsersCollection(db)
    .find({}, { projection: { _id: 0 } })
    .toArray();
}

async function getUserById(db, id) {
  return getUsersCollection(db).findOne(
    { id_usuario: id },
    { projection: { _id: 0 } }
  );
}

async function updateUser(db, id, userData) {
  const collection = getUsersCollection(db);
  const allowedFields = [
    "nombre_usuario",
    "username",
    "password",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (userData[field] !== undefined) {
      updates[field] = userData[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return null;
  }

  const result = await collection.updateOne(
    { id_usuario: id },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return getUserById(db, id);
}

async function deleteUser(db, id) {
  const result = await getUsersCollection(db).deleteOne({
    id_usuario: id,
  });

  return result.deletedCount > 0;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
