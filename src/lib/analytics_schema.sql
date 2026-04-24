-- Script para tablas de analíticas y automatización
-- Ejecutar en el SQL Editor de Supabase

-- 1. Tabla para registrar búsquedas populares
CREATE TABLE IF NOT EXISTS busquedas_stats (
    id SERIAL PRIMARY KEY,
    query TEXT UNIQUE NOT NULL,
    conteo INTEGER DEFAULT 1,
    ultima_busqueda TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Tabla para historial de sincronización Protheus
CREATE TABLE IF NOT EXISTS sync_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    fecha_fin TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(50), -- 'exito', 'error', 'en_progreso'
    productos_procesados INTEGER DEFAULT 0,
    mensaje_error TEXT,
    creado_por VARCHAR(100) DEFAULT 'sistema'
);

-- 3. Asegurar que la tabla usuarios tenga los roles correctos (opcional si ya existe)
-- ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS check_rol;
-- ALTER TABLE usuarios ADD CONSTRAINT check_rol CHECK (rol IN ('admin', 'vendedor', 'cliente', 'usuario'));
