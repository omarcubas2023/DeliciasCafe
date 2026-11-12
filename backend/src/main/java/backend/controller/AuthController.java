package backend.controller;

import backend.JwtUtil;
import backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/registro")
    public ResponseEntity<Map<String, Object>> registro(
            @RequestBody Map<String, String> datos) {
        Map<String, Object> respuesta = authService.registro(datos);
        if (respuesta.containsKey("error")) {
            return ResponseEntity.badRequest().body(respuesta);
        }
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, String> datos) {
        Map<String, Object> respuesta = authService.login(datos);
        if (respuesta.containsKey("error")) {
            return ResponseEntity.status(401).body(respuesta);
        }
        agregarToken(respuesta);
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/google")
    public ResponseEntity<Map<String, Object>> loginGoogle(
            @RequestBody Map<String, String> datos) {
        Map<String, Object> respuesta = authService.loginORegistrarGoogle(datos);
        agregarToken(respuesta);
        return ResponseEntity.ok(respuesta);
    }

    // Agrega el token JWT a la respuesta usando los datos del usuario ya armado
    @SuppressWarnings("unchecked")
    private void agregarToken(Map<String, Object> respuesta) {
        Map<String, Object> usuarioData = (Map<String, Object>) respuesta.get("usuario");
        if (usuarioData != null) {
            Long id = Long.valueOf(usuarioData.get("id").toString());
            String email = usuarioData.get("email").toString();
            String rol = usuarioData.get("rol").toString();
            String token = jwtUtil.generarToken(id, email, rol);
            respuesta.put("token", token);
        }
    }
}