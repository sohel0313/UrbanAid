package com.project.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.dto.ApiResponse;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomJwtVerificationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // 1. Check if header exists and starts with Bearer
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String jwt = authHeader.substring(7);

                // ✅ ADDED CHECK: Catch common frontend 'null' string errors
                if (jwt.equals("null") || jwt.equals("undefined") || jwt.isBlank()) {
                    log.warn("Bearer token is empty or literally 'null'/'undefined'");
                    throw new RuntimeException("Missing or malformed token string");
                }

                Claims claims = jwtUtils.validateToken(jwt);

                Long userId = claims.get("user_id", Long.class);
                String role = claims.get("user_role", String.class);
                String email = claims.getSubject();

                List<SimpleGrantedAuthority> authorities =
                        List.of(new SimpleGrantedAuthority(role));

                UserPrincipal principal =
                        new UserPrincipal(userId, email, null, authorities);

                Authentication authentication =
                        new UsernamePasswordAuthenticationToken(
                                principal, null, authorities);

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

                // Continue the chain if token is valid
                filterChain.doFilter(request, response);

            } catch (Exception e) {
                log.error("Authentication failed: {}", e.getMessage());
                SecurityContextHolder.clearContext();

                // 2. Return 401 Unauthorized instead of letting it become a 500
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");

                ApiResponse resp = new ApiResponse("Failed", "Authentication Error: " + e.getMessage());
                response.getWriter().write(objectMapper.writeValueAsString(resp));
                // ⛔ IMPORTANT: Return here to stop further execution of the chain
                return;
            }
        } else {
            // No token found, let it go to the next filter (usually permitAll or Login)
            filterChain.doFilter(request, response);
        }
    }
}