package backend.controller;

import backend.model.DetallePedido;
import backend.model.Pedido;
import backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:4200")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // POST /api/pedidos
    @PostMapping
    public ResponseEntity<Map<String, Object>> crearPedido(
            @RequestBody Map<String, Object> datos) {
        try {
            Pedido pedido = pedidoService.crearPedido(datos);
            return ResponseEntity.ok(Map.of(
                "mensaje", "¡Pedido creado exitosamente!",
                "pedido_id", pedido.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Error al crear el pedido"
            ));
        }
    }

    // GET /api/pedidos/usuario/{id}
    @GetMapping("/usuario/{id}")
    public List<Pedido> getPedidosPorUsuario(@PathVariable Long id) {
        return pedidoService.getPedidosPorUsuario(id);
    }

    // GET /api/pedidos/{id}/detalle
    @GetMapping("/{id}/detalle")
    public List<DetallePedido> getDetallePedido(@PathVariable Long id) {
        return pedidoService.getDetallePedido(id);
    }

    // GET /api/pedidos/todos
    @GetMapping("/todos")
    public List<Pedido> getTodosPedidos() {
        return pedidoService.getTodosPedidos();
    }

    // GET /api/pedidos/auditoria-pagos
    @GetMapping("/auditoria-pagos")
    public List<Map<String, Object>> getAuditoriaPagos() {
        return pedidoService.getAuditoriaPagos();
    }

    // GET /api/pedidos/usuario/{id}/detalle-completo
    @GetMapping("/usuario/{id}/detalle-completo")
    public List<Map<String, Object>> getHistorialCompleto(@PathVariable Long id) {
        return pedidoService.getHistorialCompleto(id);
    }

    // PUT /api/pedidos/{id}/estado
    @PutMapping("/{id}/estado")
    public ResponseEntity<Map<String, String>> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> datos) {
        try {
            String estado = datos.get("estado");
            String metodoPago = datos.get("metodo_pago");
            Pedido pedido = pedidoService.actualizarEstado(id, estado, metodoPago);
            if (pedido != null) {
                return ResponseEntity.ok(Map.of("mensaje", "Estado actualizado"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Error al actualizar estado"));
        }
    }
}