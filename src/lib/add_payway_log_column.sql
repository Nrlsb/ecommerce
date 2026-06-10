-- Script para agregar columna de log de Payway a la tabla de pedidos
-- Ejecuta este script en el SQL Editor de Supabase (https://supabase.com)

ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS payway_log JSONB;
