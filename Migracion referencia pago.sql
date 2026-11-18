USE delicias_cafe;

-- Ejecutar una sola vez en la base de datos existente antes de desplegar.
ALTER TABLE pedidos
ADD COLUMN referencia_pago VARCHAR(100) NULL;
