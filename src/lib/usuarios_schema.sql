-- Script para crear la tabla de usuarios personalizada
-- Debes ejecutar esto en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(200) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nombre TEXT,
  rol VARCHAR(50) DEFAULT 'usuario',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Habilitar RLS (opcional, pero recomendado)
-- ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política simple: El usuario solo puede ver su propio registro
-- (Aunque para este sistema manual, las consultas se harán mayormente vía API con service role o sin RLS estricto)
-- CREATE POLICY "Usuarios pueden ver su propio perfil" ON usuarios
--   FOR SELECT USING (auth.uid() = id);
