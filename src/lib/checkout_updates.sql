-- Script de actualización de Base de Datos para Checkout y Pagos
-- Ejecuta este script en el SQL Editor de Supabase (https://supabase.com)

-- 1. Agregar columnas para Payway a la tabla de pedidos si no existen
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS payway_tid VARCHAR(100);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS payway_auth_code VARCHAR(100);

-- 2. Agregar columnas para Detalles de Envío a la tabla de pedidos si no existen
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS metodo_entrega VARCHAR(50) DEFAULT 'envio';
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS envio_costo DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS envio_direccion TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS envio_ciudad VARCHAR(100);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS envio_codigo_postal VARCHAR(20);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS envio_provincia VARCHAR(100);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS envio_telefono VARCHAR(50);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS envio_notas TEXT;

-- 3. Agregar columnas para Detalles de Facturación a la tabla de pedidos si no existen
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS facturacion_tipo VARCHAR(50) DEFAULT 'Consumidor Final'; -- Consumidor Final, Factura A, Factura B
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS facturacion_nombre VARCHAR(200); -- Razón Social / Nombre Factura
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS facturacion_documento VARCHAR(50); -- CUIT / CUIL / DNI

-- 4. Agregar columna 'comprados' a la tabla de productos para llevar contador de ventas
ALTER TABLE productos ADD COLUMN IF NOT EXISTS comprados INTEGER DEFAULT 0;

-- 5. Crear función y disparador (trigger) para descontar stock e incrementar comprados al pagar
CREATE OR REPLACE FUNCTION deducir_stock_pedido()
RETURNS TRIGGER AS $$
DECLARE
  item RECORD;
BEGIN
  -- Verificar si el estado cambió a 'pagado' y antes no estaba en 'pagado'
  IF NEW.estado = 'pagado' AND (OLD.estado IS NULL OR OLD.estado != 'pagado') THEN
    -- Recorrer los ítems del pedido
    FOR item IN 
      SELECT producto_id, cantidad 
      FROM pedido_items 
      WHERE pedido_id = NEW.id
    LOOP
      -- Descontar stock y aumentar contador de comprados
      UPDATE productos 
      SET 
        stock = GREATEST(0, stock - item.cantidad),
        comprados = COALESCE(comprados, 0) + item.cantidad
      WHERE id = item.producto_id;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el disparador en la tabla de pedidos si no existe
DROP TRIGGER IF EXISTS trigger_deducir_stock_pedido ON pedidos;
CREATE TRIGGER trigger_deducir_stock_pedido
AFTER UPDATE ON pedidos
FOR EACH ROW
EXECUTE FUNCTION deducir_stock_pedido();
