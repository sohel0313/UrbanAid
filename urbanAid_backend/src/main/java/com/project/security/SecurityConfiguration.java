package com.project.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfiguration {

    private final CustomJwtVerificationFilter jwtFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // ✅ Enable CORS
            .cors(cors -> {})
            
            // Disable CSRF (JWT + REST)
            .csrf(csrf -> csrf.disable())

            // Stateless session
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                // 🔓 Public endpoints
                .requestMatchers(
                        "/auth/**",
                        "/citizens/register",
                        "/volunteers/register",
                        "/test-email",
                        "/alerts",
                        "/swagger-ui/**",
                        "/v3/api-docs/**"
                ).permitAll()

                // Preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ADMIN
                .requestMatchers(HttpMethod.GET, "/reports/all")
                .hasRole("ADMIN")

                // CITIZEN
                .requestMatchers(HttpMethod.POST, "/reports")
                .hasRole("CITIZEN")
                .requestMatchers(HttpMethod.GET, "/reports/my")
                .hasRole("CITIZEN")
                .requestMatchers(HttpMethod.POST, "/reports/upload-image")
                .hasRole("CITIZEN")

                // VOLUNTEER
                .requestMatchers(HttpMethod.GET, "/reports/nearby")
                .hasRole("VOLUNTEER")
                .requestMatchers(HttpMethod.PUT, "/reports/*/claim")
                .hasRole("VOLUNTEER")
                .requestMatchers(HttpMethod.PUT, "/reports/*/status")
                .hasRole("VOLUNTEER")

                // 🔒 Everything else
                .anyRequest().authenticated()
            )

            // JWT filter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Authentication manager
    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    // Password encoder
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000") // Your React Port
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
