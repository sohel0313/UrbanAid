package com.project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.project.dto.AuthRequest;
import com.project.dto.AuthResp;
import com.project.security.JwtUtils;
import com.project.security.UserPrincipal;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins = "http://localhost:3000")

@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    @Operation(description = "Login for Citizen / Volunteer / Admin")
    public ResponseEntity<AuthResp> login(@RequestBody @Valid AuthRequest request) {

        log.info("Login attempt for {}", request.getEmail());

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword())
        );

        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();

        // Generate the token
        String token = jwtUtils.generateToken(principal);

        String role = principal.getAuthorities().iterator().next().getAuthority();
        Long userId = principal.getUserId();

        return ResponseEntity.ok(
                new AuthResp(token, "Login successful", role, userId));
    }
}
