-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase

-- 1. Tabla de Categorías
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Tabla de Productos
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  categoria_id INTEGER REFERENCES categorias(id),
  nombre VARCHAR(200) NOT NULL,
  marca VARCHAR(100),
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  imagen_url TEXT,
  destacado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Tabla de Pedidos (Orders)
CREATE TABLE pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_nombre VARCHAR(200) NOT NULL,
  cliente_email VARCHAR(200) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente', -- pendiente, pagado, enviado
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Tabla de Detalles del Pedido (Order Items)
CREATE TABLE pedido_items (
  id SERIAL PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL
);

-- INSERCIÓN DE DATOS DE PRUEBA (Opcional)
INSERT INTO categorias (nombre, slug, descripcion) VALUES
('Pintura Interior', 'interior', 'Pinturas de alto poder cubritivo para interiores'),
('Pintura Exterior', 'exterior', 'Impermeabilizantes y pinturas para frentes');

INSERT INTO productos (categoria_id, nombre, marca, descripcion, precio, stock, destacado) VALUES
(1, 'Látex Interior Premium 20L', 'ColorMaster', 'Excelente cubritivo.', 45000, 15, TRUE),
(2, 'Impermeabilizante Frentes 20L', 'ProtecExterior', 'Protección contra lluvia.', 58000, 20, TRUE);
