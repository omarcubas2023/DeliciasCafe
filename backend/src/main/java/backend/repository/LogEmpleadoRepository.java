package backend.repository;

import backend.model.LogEmpleado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LogEmpleadoRepository extends JpaRepository<LogEmpleado, Long> {
    List<LogEmpleado> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
    List<LogEmpleado> findByRolOrderByFechaDesc(String rol);
}