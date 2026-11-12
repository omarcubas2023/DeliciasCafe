package backend.service;

import backend.model.DetallePedido;
import backend.model.Pedido;
import backend.repository.DetallePedidoRepository;
import backend.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    // Crear nuevo pedido
    @SuppressWarnings("unchecked")
    @Transactional
    public Pedido crearPedido(Map<String, Object> datos) {
        // Crear el pedido principal
        Pedido pedido = new Pedido();
        pedido.setUsuarioId(Long.valueOf(datos.get("usuario_id").toString()));
        pedido.setTotal(Double.valueOf(datos.get("total").toString()));
        pedido.setMetodoPago(datos.get("metodo_pago") != null ?
            datos.get("metodo_pago").toString() : "efectivo");
        pedido.setEstado("pendiente");
        pedido.setFechaPedido(LocalDateTime.now());

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // Guardar cada item del pedido
        List<Map<String, Object>> items =
            (List<Map<String, Object>>) datos.get("items");

        for (Map<String, Object> item : items) {
            DetallePedido detalle = new DetallePedido();
            detalle.setPedidoId(pedidoGuardado.getId());
            detalle.setProductoId(Long.valueOf(item.get("producto_id").toString()));
            detalle.setCantidad(Integer.valueOf(item.get("cantidad").toString()));
            detalle.setPrecioUnitario(
                Double.valueOf(item.get("precio_unitario").toString()));
            detallePedidoRepository.save(detalle);
        }

        return pedidoGuardado;
    }

    // Obtener pedidos de un usuario
    public List<Pedido> getPedidosPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioIdOrderByFechaPedidoDesc(usuarioId);
    }

    // Obtener detalle de un pedido
    public List<DetallePedido> getDetallePedido(Long pedidoId) {
        return detallePedidoRepository.findByPedidoId(pedidoId);
    }

    public List<Pedido> getTodosPedidos() {
        return pedidoRepository.findAll();
    }

    public Pedido actualizarEstado(Long id, String estado, String metodoPago) {
        Pedido pedido = pedidoRepository.findById(id).orElse(null);
            if (pedido != null) {
                pedido.setEstado(estado);
                if (metodoPago != null && !metodoPago.isEmpty()) {
                    pedido.setMetodoPago(metodoPago);
            }
            return pedidoRepository.save(pedido);
        }
        return null;
    }

    @Autowired
    private backend.repository.ProductoRepository productoRepository;

    public List<Map<String, Object>> getHistorialCompleto(Long usuarioId) {
        List<Pedido> pedidos = pedidoRepository.findByUsuarioIdOrderByFechaPedidoDesc(usuarioId);
        List<Map<String, Object>> resultado = new java.util.ArrayList<>();

        for (Pedido pedido : pedidos) {
            Map<String, Object> pedidoData = new java.util.HashMap<>();
            pedidoData.put("id", pedido.getId());
            pedidoData.put("fechaPedido", pedido.getFechaPedido());
            pedidoData.put("total", pedido.getTotal());
            pedidoData.put("estado", pedido.getEstado());
            pedidoData.put("metodoPago", pedido.getMetodoPago());

        List<DetallePedido> detalles = detallePedidoRepository.findByPedidoId(pedido.getId());
        List<Map<String, Object>> items = new java.util.ArrayList<>();

            for (DetallePedido detalle : detalles) {
                Map<String, Object> item = new java.util.HashMap<>();
                item.put("cantidad", detalle.getCantidad());
                item.put("precioUnitario", detalle.getPrecioUnitario());

                backend.model.Producto producto = productoRepository
                    .findById(detalle.getProductoId()).orElse(null);
                item.put("nombreProducto", producto != null ? producto.getNombre() : "Producto");
                items.add(item);
            }

            pedidoData.put("items", items);
            resultado.add(pedidoData);
        }

        return resultado;
    }

    public List<Map<String, Object>> getAuditoriaPagos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        List<Map<String, Object>> resultado = new java.util.ArrayList<>();

        for (Pedido pedido : pedidos) {
            if (pedido.getEstado().equals("pendiente")) continue;

            Map<String, Object> pedidoData = new java.util.HashMap<>();
            pedidoData.put("id", pedido.getId());
            pedidoData.put("fechaPedido", pedido.getFechaPedido());
            pedidoData.put("total", pedido.getTotal());
            pedidoData.put("estado", pedido.getEstado());
            pedidoData.put("metodoPago", pedido.getMetodoPago());
            pedidoData.put("usuarioId", pedido.getUsuarioId());

            List<DetallePedido> detalles = detallePedidoRepository.findByPedidoId(pedido.getId());
            List<Map<String, Object>> items = new java.util.ArrayList<>();

            for (DetallePedido detalle : detalles) {
                Map<String, Object> item = new java.util.HashMap<>();
                item.put("cantidad", detalle.getCantidad());
                item.put("precioUnitario", detalle.getPrecioUnitario());

                backend.model.Producto producto = productoRepository
                    .findById(detalle.getProductoId()).orElse(null);
                item.put("nombreProducto", producto != null ? producto.getNombre() : "Producto");
                items.add(item);
            }

            pedidoData.put("items", items);
            resultado.add(pedidoData);
        }

        // Ordenar del más reciente al más antiguo
        resultado.sort((a, b) -> {
            java.time.LocalDateTime fechaA = (java.time.LocalDateTime) a.get("fechaPedido");
            java.time.LocalDateTime fechaB = (java.time.LocalDateTime) b.get("fechaPedido");
            return fechaB.compareTo(fechaA);
        });

        return resultado;
    }
}