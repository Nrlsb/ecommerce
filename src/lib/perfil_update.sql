-- Script para agregar columnas de perfil a la tabla de usuarios existente.
-- Copia y ejecuta este script en el SQL Editor de tu proyecto en Supabase (https://supabase.com).

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefono VARCHAR(50);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS direccion TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ciudad VARCHAR(100);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS codigo_postal VARCHAR(20);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS provincia VARCHAR(100);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS dni VARCHAR(50);
