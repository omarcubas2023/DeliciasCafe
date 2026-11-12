USE delicias_cafe;

-- Tabla de logs
DROP TABLE IF EXISTS logs_empleados;
CREATE TABLE logs_empleados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre_usuario VARCHAR(100),
  rol VARCHAR(50) NOT NULL,
  accion TEXT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla estado de pedidos
CREATE TABLE IF NOT EXISTS estado_pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  estado VARCHAR(50) NOT NULL,
  usuario_id INT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  notas TEXT,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- Agregar columna rol
ALTER TABLE usuarios ADD COLUMN rol VARCHAR(50) DEFAULT 'cliente';

-- Actualizar TODOS los usuarios con hash compatible con Spring Boot
-- La contraseña será: 123456
UPDATE usuarios SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y'
WHERE id > 0;

-- Ver todos los logs de empleados
SELECT 
  l.id,
  l.nombre_usuario,
  l.rol,
  l.accion,
  l.fecha
FROM logs_empleados l
ORDER BY l.fecha DESC;