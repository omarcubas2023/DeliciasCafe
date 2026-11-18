package backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "fecha_pedido")
    private LocalDateTime fechaPedido = LocalDateTime.now();

    @Column(nullable = false)
    private Double total;

    private String estado = "pendiente";

    @Column(name = "metodo_pago")
    private String metodoPago = "efectivo";

    @Column(name = "referencia_pago")
    private String referenciaPago;
}