-- Script para agregar la columna autoincremental nro_pedido a la tabla pedidos
-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase (https://supabase.com)

ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS nro_pedido SERIAL;
