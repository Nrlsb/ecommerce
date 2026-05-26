-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase para crear la tabla de Sucursales

CREATE TABLE IF NOT EXISTS sucursales (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  telefono VARCHAR(100),
  horarios VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Permisos de lectura pública (en caso de que RLS esté activo)
-- ALTER TABLE sucursales ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Permitir lectura pública de sucursales" ON sucursales FOR SELECT USING (true);
-- CREATE POLICY "Permitir gestión total a administradores" ON sucursales FOR ALL TO authenticated USING (true);
