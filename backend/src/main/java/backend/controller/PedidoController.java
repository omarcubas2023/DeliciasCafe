package backend.controller;

import backend.model.DetallePedido;
import backend.model.Pedido;
import backend.model.Usuario;
import backend.repository.UsuarioRepository;
import backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:4200")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // POST /api/pedidos
    @PostMapping
    public ResponseEntity<Map<String, Object>> crearPedido(
            @RequestBody Map<String, Object> datos,
            Authentication authentication) {
        try {
            Long usuarioId = Long.valueOf(datos.get("usuario_id").toString());
            if (!puedeConsultarUsuario(usuarioId, authentication)) {
                return ResponseEntity.status(403).body(Map.of(
                    "error", "No puedes crear pedidos para otro usuario."
                ));
            }
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
    public ResponseEntity<?> getPedidosPorUsuario(
            @PathVariable Long id,
            Authentication authentication) {
        if (!puedeConsultarUsuario(id, authentication)) {
            return ResponseEntity.status(403).body(Map.of(
                "error", "No puedes consultar pedidos de otro usuario."
            ));
        }
        return ResponseEntity.ok(pedidoService.getPedidosPorUsuario(id));
    }

    // GET /api/pedidos/{id}/detalle
    @GetMapping("/{id}/detalle")
    public ResponseEntity<?> getDetallePedido(
            @PathVariable Long id,
            Authentication authentication) {
        Pedido pedido = pedidoService.getPedido(id);
        if (pedido == null) {
            return ResponseEntity.notFound().build();
        }
        if (!puedeConsultarUsuario(pedido.getUsuarioId(), authentication)) {
            return ResponseEntity.status(403).body(Map.of(
                "error", "No puedes consultar este pedido."
            ));
        }
        List<DetallePedido> detalles = pedidoService.getDetallePedido(id);
        return ResponseEntity.ok(detalles);
    }

    private boolean puedeConsultarUsuario(Long usuarioId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        boolean esPersonal = authentication.getAuthorities().stream()
            .anyMatch(authority -> Set.of(
                "ROLE_CAJERO", "ROLE_ADMINISTRADOR", "ROLE_COCINERO", "ROLE_MESERO"
            ).contains(authority.getAuthority()));
        if (esPersonal) {
            return true;
        }
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName()).orElse(null);
        return usuario != null && usuario.getId().equals(usuarioId);
    }

    // GET /api/pedidos/todos
    @GetMapping("/todos")
    public List<Pedido> getTodosPedidos() {
        return pedidoService.getPedidosDelDia();
    }

    // GET /api/pedidos/auditoria-pagos
    @GetMapping("/auditoria-pagos")
    public List<Map<String, Object>> getAuditoriaPagos() {
        return pedidoService.getAuditoriaPagos();
    }

    // GET /api/pedidos/usuario/{id}/detalle-completo
    @GetMapping("/usuario/{id}/detalle-completo")
    public ResponseEntity<?> getHistorialCompleto(
            @PathVariable Long id,
            Authentication authentication) {
        if (!puedeConsultarUsuario(id, authentication)) {
            return ResponseEntity.status(403).body(Map.of(
                "error", "No puedes consultar pedidos de otro usuario."
            ));
        }
        return ResponseEntity.ok(pedidoService.getHistorialCompleto(id));
    }

    // PUT /api/pedidos/{id}/estado
    @PutMapping("/{id}/estado")
    public ResponseEntity<Map<String, String>> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> datos) {
        try {
            String estado = datos.get("estado");
            String metodoPago = datos.get("metodo_pago");
            String referenciaPago = datos.get("referencia_pago");
            Pedido pedido = pedidoService.actualizarEstado(
                id, estado, metodoPago, referenciaPago);
            if (pedido != null) {
                return ResponseEntity.ok(Map.of("mensaje", "Estado actualizado"));
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Error al actualizar estado"));
        }
    }
}