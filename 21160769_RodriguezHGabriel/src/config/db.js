//Cliente oficial de Supabase para conectarnos a la base de datos
const { createClient } = require("@supabase/supabase-js");
const env = require("./env");

const supabase = createClient(env.supabaseUrl, env.supabaseKey, {
  //Es un backend: no necesitamos guardar sesiones de usuario
  auth: { persistSession: false },
});

//Funcion para verificar que la base de datos responde y que existe la tabla usuarios
async function probarConexion() {
  const { error } = await supabase.from("usuarios").select("id").limit(1);
  if (error) throw new Error(error.message);
}

module.exports = { supabase, probarConexion };
