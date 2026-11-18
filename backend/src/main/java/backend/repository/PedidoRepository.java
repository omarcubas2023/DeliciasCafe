package backend.repository;

import backend.model.Pedido;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioIdOrderByFechaPedidoDesc(Long usuarioId);
    List<Pedido> findByFechaPedidoGreaterThanEqualAndFechaPedidoLessThanOrderByFechaPedidoDesc(
        LocalDateTime desde, LocalDateTime hasta);

    @Modifying
    @Query("""
        UPDATE Pedido p
        SET p.estado = 'pagado',
            p.metodoPago = :metodoPago,
            p.referenciaPago = :referenciaPago
        WHERE p.id = :id AND p.estado = 'pendiente'
        """)
    int registrarPagoPendiente(
        @Param("id") Long id,
        @Param("metodoPago") String metodoPago,
        @Param("referenciaPago") String referenciaPago);
}