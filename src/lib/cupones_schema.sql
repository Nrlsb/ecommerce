-- Script para crear la tabla de cupones y actualizar pedidos
-- Debes ejecutar esto en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS cupones (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  descuento_porcentual DECIMAL(5, 2) DEFAULT 0,
  descuento_fijo DECIMAL(10, 2) DEFAULT 0,
  compra_minima DECIMAL(10, 2) DEFAULT 0,
  fecha_expiracion TIMESTAMP WITH TIME ZONE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insertar cupones de prueba
INSERT INTO cupones (codigo, descuento_porcentual, compra_minima, activo) 
VALUES ('MERCURIO10', 10.00, 10000.00, TRUE)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO cupones (codigo, descuento_fijo, compra_minima, activo) 
VALUES ('BIENVENIDA2000', 2000.00, 15000.00, TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- Agregar columnas a pedidos si no existen
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cupon_aplicado VARCHAR(50);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS descuento_aplicado DECIMAL(10, 2) DEFAULT 0;
