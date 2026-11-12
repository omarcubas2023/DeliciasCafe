package backend.controller;

import backend.model.LogEmpleado;
import backend.repository.LogEmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:4200")
public class LogController {

    @Autowired
    private LogEmpleadoRepository logRepository;

    // POST /api/logs — Registrar acción
    @PostMapping
    public ResponseEntity<Map<String, String>> registrarLog(
            @RequestBody Map<String, Object> datos) {
        try {
            LogEmpleado log = new LogEmpleado();
            log.setUsuarioId(Long.valueOf(datos.get("usuario_id").toString()));
            log.setRol(datos.get("rol").toString());
            log.setAccion(datos.get("accion").toString());
            log.setFecha(LocalDateTime.now());
            logRepository.save(log);
            return ResponseEntity.ok(Map.of("mensaje", "Log registrado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Error al registrar log"));
        }
    }

    // GET /api/logs — Obtener todos los logs
    @GetMapping
    public List<LogEmpleado> getTodosLogs() {
        return logRepository.findAll();
    }

    // GET /api/logs/rol/{rol} — Logs por rol
    @GetMapping("/rol/{rol}")
    public List<LogEmpleado> getLogsPorRol(@PathVariable String rol) {
        return logRepository.findByRolOrderByFechaDesc(rol);
    }
}