package backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                .requestMatchers("/api/config/pagos").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/pedidos/todos")
                    .hasAnyRole("CAJERO", "ADMINISTRADOR", "COCINERO", "MESERO")
                .requestMatchers(HttpMethod.GET, "/api/pedidos/auditoria-pagos")
                    .hasAnyRole("CAJERO", "ADMINISTRADOR")
                .requestMatchers(HttpMethod.PUT, "/api/pedidos/*/estado")
                    .hasAnyRole("CAJERO", "ADMINISTRADOR", "COCINERO", "MESERO")
                .requestMatchers("/api/pedidos/**").authenticated()
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}