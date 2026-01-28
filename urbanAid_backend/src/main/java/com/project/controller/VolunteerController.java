package com.project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.project.dto.VolunteerDTO;
import com.project.security.UserPrincipal;
import com.project.service.VolunteerService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/volunteers")
@CrossOrigin(origins = "http://localhost:3000")

@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;

    // Admin registers a volunteer
    
    @PostMapping("/register")
    @Operation(description = "Register a new volunteer")
    public ResponseEntity<VolunteerDTO> registerVolunteer(
            @Valid @RequestBody VolunteerDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(volunteerService.registerVolunteer(dto));
    }

    // Volunteer views own profile

    @GetMapping("/me")
    @PreAuthorize("hasRole('VOLUNTEER')")
    @Operation(description = "Get logged-in volunteer profile")
    public ResponseEntity<VolunteerDTO> getMyProfile(Authentication authentication) {

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(
                volunteerService.getVolunteerByUserId(principal.getUserId()));
    }
}
