package com.project.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.service.ReportService;
import com.project.service.UserService;
import com.project.service.VolunteerService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:3000")

@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final VolunteerService volunteerService;
    private final ReportService reportService;

    @GetMapping("/users")
    public ResponseEntity<?> listAllUsers() {
        return ResponseEntity.ok(userService.listAllUsers());
    }

    @GetMapping("/volunteers")
    public ResponseEntity<?> listAllVolunteers() {
        return ResponseEntity.ok(volunteerService.listAllVolunteers());
    }

    @GetMapping("/reports")
    public ResponseEntity<?> listAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }
}
