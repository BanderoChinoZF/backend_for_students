-- Script para crear la tabla de usuarios en Supabase (PostgreSQL)
-- Ejecutar en Supabase -> SQL Editor -> New query -> Run

CREATE TABLE IF NOT EXISTS public.usuarios (
  id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  edad       INT NULL,
  username   VARCHAR(50)  NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seguridad a nivel de fila (RLS): solo se permite lo que digan las politicas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Politica para que el backend pueda hacer el CRUD con la llave publishable (rol anon)
DROP POLICY IF EXISTS "crud_usuarios_backend" ON public.usuarios;
CREATE POLICY "crud_usuarios_backend" ON public.usuarios
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- Datos de prueba (los mismos que tenia usuarios.json)
INSERT INTO public.usuarios (nombre, email, edad, username, password) VALUES
  ('Ana Gonzales',      'anita99@gmail.com',  28, 'anita99',   '123456789'),
  ('Diana Janet Perez', 'janet_06@gmail.com', 28, 'Diana_Net', '3r4t5y56u6')
ON CONFLICT (email) DO NOTHING;
