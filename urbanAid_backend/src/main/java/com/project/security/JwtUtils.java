package com.project.security;

import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtils {

    @Value("${jwt.expiration.time}")
    private long jwtExpirationTime;

    @Value("${jwt.secret}")
    private String jwtSecret;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        log.info("Initializing JWT secret key");
        secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // Generate JWT
    public String generateToken(UserPrincipal principal) {

        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationTime);

        // Extract single role (you are using single-role system)
        String role = principal.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        return Jwts.builder()
                .subject(principal.getUsername())     // email
                .issuedAt(now)
                .expiration(expiry)
                .claims(Map.of(
                        "user_id", principal.getUserId(),
                        "user_role", role
                ))
                .signWith(secretKey)
                .compact();
    }

    // Validate JWT
    public Claims validateToken(String jwt) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(jwt)
                .getPayload();
    }
}
