USE delicias_cafe;
-- Ver los pedidos realizados
SELECT * FROM pedidos;
-- Ver el detalle de cada pedido
SELECT 
  p.id AS pedido_id,
  p.fecha_pedido,
  p.total,
  p.estado,
  p.metodo_pago,
  u.nombre AS cliente,
  pr.nombre AS producto,
  dp.cantidad,
  dp.precio_unitario
FROM pedidos p
JOIN usuarios u ON p.usuario_id = u.id
JOIN detalle_pedido dp ON p.id = dp.pedido_id
JOIN productos pr ON dp.producto_id = pr.id
ORDER BY p.fecha_pedido DESC;