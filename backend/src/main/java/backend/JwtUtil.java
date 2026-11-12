package backend;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secreto;

    private final long EXPIRACION_MS = 1000 * 60 * 60 * 8; // 8 horas

    private SecretKey clave() {
        return Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
    }

    // Genera un token a partir de los datos del usuario
    public String generarToken(Long id, String email, String rol) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", id);
        claims.put("email", email);
        claims.put("rol", rol);

        return Jwts.builder()
            .claims(claims)
            .subject(email)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + EXPIRACION_MS))
            .signWith(clave())
            .compact();
    }

    // Extrae los datos (claims) de un token
    public Claims extraerClaims(String token) {
        return Jwts.parser()
            .verifyWith(clave())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    // Verifica si el token es válido (firma correcta y no expirado)
    public boolean esTokenValido(String token) {
        try {
            extraerClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Long extraerId(String token) {
        Object id = extraerClaims(token).get("id");
        return Long.valueOf(id.toString());
    }

    public String extraerRol(String token) {
        return extraerClaims(token).get("rol", String.class);
    }
}