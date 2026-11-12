-- BASE DE DATOS: Delicias & Café
-- Crea la base de datos
CREATE DATABASE IF NOT EXISTS delicias_cafe;
-- Selecciona la base de datos
USE delicias_cafe;
-- ---------------------------------
-- TABLA 1: usuarios
-- Guarda los datos de cada cliente
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ---------------------------------
-- TABLA 2: productos
-- Guarda todos los productos del menú
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(50),
  descripcion TEXT,
  imagen VARCHAR(255),
  activo BOOLEAN DEFAULT TRUE
);
-- ---------------------------------
-- TABLA 3: pedidos
-- Guarda cada pedido que se realiza
CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  fecha_pedido DATETIME NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
-- ---------------------------------
-- TABLA 4: detalle_pedido
-- Guarda qué productos tiene cada pedido
CREATE TABLE IF NOT EXISTS detalle_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);
-- ---------------------------------
-- DATOS DE EJEMPLO: Productos del menú
INSERT INTO productos (nombre, precio, categoria, descripcion, imagen) VALUES
-- Bebidas
('Café Americano', 8.50,  'Bebidas', 'Café espresso con agua caliente', 'americano.jpg'),
('Cappuccino', 12.00, 'Bebidas', 'Espresso con leche vaporizada y espuma', 'cappuccino.jpg'),
('Latte', 11.50, 'Bebidas', 'Espresso con abundante leche vaporizada', 'latte.jpg'),
('Mocha', 13.00, 'Bebidas', 'Espresso con chocolate y leche vaporizada', 'mocha.jpg'),
('Té Verde', 7.00,  'Bebidas', 'Té verde premium con notas herbales', 'te-verde.jpg'),

-- Panadería
('Croissant', 6.00, 'Panadería', 'Croissant de mantequilla recién horneado', 'croissant.jpg'),
('Muffin', 5.50, 'Panadería', 'Muffin esponjoso de arándanos', 'muffin.jpg'),
('Bagel', 7.00, 'Panadería', 'Bagel con queso crema', 'bagel.jpg'),

-- Almuerzos
('Sándwich Club', 14.00, 'Almuerzos', 'Sándwich con pollo, tocino, lechuga y tomate', 'sandwich.jpg'),
('Ensalada César', 12.00, 'Almuerzos', 'Ensalada con pollo a la parrilla y aderezo', 'ensalada.jpg'),
('Wrap de Pollo', 13.00, 'Almuerzos', 'Wrap con pollo grillado y verduras frescas', 'wrap.jpg'),

-- Postres
('Tiramisú', 15.00, 'Postres', 'Postre italiano de café con mascarpone', 'tiramisu.jpg'),
('Brownie con Helado', 13.00, 'Postres', 'Brownie de chocolate caliente con helado', 'brownie.jpg'),
('Flan de Caramelo', 12.00, 'Postres', 'Flan casero con salsa de caramelo', 'flan.jpg'),

-- Desayunos
('Desayuno Completo', 18.00, 'Desayunos', 'Huevos, tostadas, jugo y café americano', 'desayuno.jpg'),
('Pancakes', 14.00, 'Desayunos', 'Pancakes esponjosos con miel de maple', 'pancakes.jpg'),
('Avena con Frutas', 10.00, 'Desayunos', 'Avena cremosa con frutas frescas de temporada', 'avena.jpg');
-- ---------------------------------
-- Columna de metodos de pago
ALTER TABLE pedidos 
ADD COLUMN metodo_pago VARCHAR(50) DEFAULT 'efectivo';
-- Ver las tablas creadas
SHOW TABLES;
-- Ver los productos insertados
SELECT * FROM productos;