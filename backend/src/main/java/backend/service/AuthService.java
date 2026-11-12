package backend.service;

import backend.model.Usuario;
import backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Registrar nuevo usuario
    public Map<String, Object> registro(Map<String, String> datos) {
        Map<String, Object> respuesta = new HashMap<>();

        // Verificar si el email ya existe
        if (usuarioRepository.existsByEmail(datos.get("email"))) {
            respuesta.put("error", "El email ya está registrado");
            return respuesta;
        }

        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(datos.get("nombre"));
        usuario.setEmail(datos.get("email"));
        usuario.setPassword(passwordEncoder.encode(datos.get("password")));
        // Usar el rol que viene del frontend
        String rol = datos.get("rol") != null ? datos.get("rol") : "cliente";
        usuario.setRol(rol);

        usuarioRepository.save(usuario);

        respuesta.put("mensaje", "Usuario registrado exitosamente");
        return respuesta;
    }

    // Iniciar sesión
    public Map<String, Object> login(Map<String, String> datos) {
        Map<String, Object> respuesta = new HashMap<>();

        Optional<Usuario> usuarioOpt =
            usuarioRepository.findByEmail(datos.get("email"));

        if (usuarioOpt.isEmpty()) {
            respuesta.put("error", "Email o contraseña incorrectos");
            return respuesta;
        }

        Usuario usuario = usuarioOpt.get();

        // Convertir $2b$ a $2a$ para compatibilidad con Node.js
        String passwordDB = usuario.getPassword();
            if (passwordDB.startsWith("$2b$")) {
                passwordDB = "$2a$" + passwordDB.substring(4);
        }

        // Verificar contraseña
        if (!passwordEncoder.matches(datos.get("password"), passwordDB)) {
            respuesta.put("error", "Email o contraseña incorrectos");
            return respuesta;
        }

        // Respuesta exitosa
        Map<String, Object> usuarioData = new HashMap<>();
        usuarioData.put("id", usuario.getId());
        usuarioData.put("nombre", usuario.getNombre());
        usuarioData.put("email", usuario.getEmail());
        usuarioData.put("rol", usuario.getRol());

        respuesta.put("mensaje", "Login exitoso");
        respuesta.put("usuario", usuarioData);
        return respuesta;
    }

    // Login o registro con Google
    public Map<String, Object> loginORegistrarGoogle(Map<String, String> datos) {
        Map<String, Object> respuesta = new HashMap<>();
        String email = datos.get("email");
        String nombre = datos.get("nombre");

    // Buscar si ya existe el usuario
    Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

    Usuario usuario;
        if (usuarioOpt.isPresent()) {
            // Ya existe, usar ese
            usuario = usuarioOpt.get();
        } else {
            // No existe, crear nuevo
            usuario = new Usuario();
            usuario.setNombre(nombre);
            usuario.setEmail(email);
            usuario.setPassword(passwordEncoder.encode("google-auth-" + email));
            usuario.setRol("cliente");
            usuarioRepository.save(usuario);
        }

        Map<String, Object> usuarioData = new HashMap<>();
        usuarioData.put("id", usuario.getId());
        usuarioData.put("nombre", usuario.getNombre());
        usuarioData.put("email", usuario.getEmail());
        usuarioData.put("rol", usuario.getRol());

        respuesta.put("mensaje", "Login exitoso");
        respuesta.put("usuario", usuarioData);
        return respuesta;
    }
}