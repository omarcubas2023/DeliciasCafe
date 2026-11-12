package backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "logs_empleados")
public class LogEmpleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(nullable = false)
    private String rol;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String accion;

    @Column(nullable = false)
    private LocalDateTime fecha = LocalDateTime.now();
}