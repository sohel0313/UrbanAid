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
            .cors(cors -> {})
            
            // Disable CSRF (JWT + REST)
            .csrf(csrf -> csrf.disable())

            // Stateless session
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                // Public endpoints
                .requestMatchers(
                                "/auth/**",
                        "/citizens/register",
                        "/volunteers/register",
                        "/users/register",
                        "/users/signin",
                        "/test-email",
                        "/alerts",
                        "/swagger-ui/**",
                        "/v3/api-docs/**"
                ).permitAll()

                // Preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.GET,"/reports/image/**").permitAll()

                // ADMIN
                .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET, "/reports/all").hasAuthority("ROLE_ADMIN")

                // CITIZEN
                .requestMatchers(HttpMethod.POST, "/reports")
                .hasAuthority("ROLE_CITIZEN")
                // Allow both citizens and volunteers to fetch "my" reports
                .requestMatchers(HttpMethod.GET, "/reports/my")
                .hasAnyAuthority("ROLE_CITIZEN","ROLE_VOLUNTEER")
                .requestMatchers(HttpMethod.POST, "/reports/upload-image")
                .hasAuthority("ROLE_CITIZEN")

                // VOLUNTEER
                .requestMatchers(HttpMethod.GET, "/reports/nearby")
                .hasAuthority("ROLE_VOLUNTEER")
                .requestMatchers(HttpMethod.PUT, "/reports/*/claim")
                .hasAuthority("ROLE_VOLUNTEER")
                .requestMatchers(HttpMethod.PUT, "/reports/*/status")
                .hasAuthority("ROLE_VOLUNTEER")

                // Allow fetching a single report by id for authenticated users with roles
                .requestMatchers(HttpMethod.GET, "/reports/*")
                .hasAnyAuthority("ROLE_CITIZEN","ROLE_VOLUNTEER","ROLE_ADMIN")

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
                        .allowedOrigins("http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173") // React / Vite dev ports
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
