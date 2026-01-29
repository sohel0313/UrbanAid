package com.project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.project.dto.CreateUserDTO;
import com.project.dto.UserDTO;
import com.project.security.UserPrincipal;
import com.project.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/citizens")
@CrossOrigin(origins = "http://localhost:3000")

@RequiredArgsConstructor
public class CitizenController {

    private final UserService userService;

    // Citizen self registration
    
    @PostMapping("/register")
    @Operation(description = "Register a new citizen")
    public ResponseEntity<UserDTO> registerCitizen(
            @Valid @RequestBody CreateUserDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.createUser(dto));
    }

    // Citizen views own profile
    
    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_CITIZEN')")
    @Operation(description = "Get logged-in citizen profile")
    public ResponseEntity<UserDTO> getMyProfile(Authentication authentication) {

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        return ResponseEntity.ok(
                userService.getUserById(principal.getUserId())
        );
    }

}
