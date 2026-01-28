package com.project.controller;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.dto.CreateReportDTO;
import com.project.dto.ReportDTO;
import com.project.entities.Status;
import com.project.security.UserPrincipal;
import com.project.service.ReportService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final ReportService reportService;

    // 1️⃣ CITIZEN CREATES REPORT
    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ReportDTO> createReport(
            @RequestParam Long citizenId,
            @RequestBody @Valid CreateReportDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reportService.createReport(dto, citizenId));
    }

    // 2️⃣ VOLUNTEER VIEWS NEARBY REPORTS
    @GetMapping("/nearby")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<List<ReportDTO>> getNearbyReports(
            @RequestParam Long volunteerId) {

        return ResponseEntity.ok(
                reportService.getNearbyUnassignedReports(volunteerId));
    }

    // 3️⃣ VOLUNTEER CLAIMS REPORT
    @PutMapping("/{reportId}/claim")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<ReportDTO> claimReport(
            @PathVariable Long reportId,
            @RequestParam Long volunteerId) {

        return ResponseEntity.ok(
                reportService.claimReport(reportId, volunteerId));
    }

    // 4️⃣ VOLUNTEER UPDATES STATUS
    @PutMapping("/{reportId}/status")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<ReportDTO> updateStatus(
            @PathVariable Long reportId,
            @RequestParam Status status,
            @RequestParam Long volunteerId) {

        return ResponseEntity.ok(
                reportService.updateReportStatus(reportId, status, volunteerId));
    }
    
    
    @PostMapping("/upload-image")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<String> uploadImage(
            @RequestParam("image") MultipartFile image) {
    	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    	log.info("AUTH = {}", auth);


        try {
            if (image.isEmpty()) {
                return ResponseEntity.badRequest().body("Empty image");
            }

            String uploadDir = "uploads/reports/";
            Files.createDirectories(Paths.get(uploadDir));

            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);

            Files.copy(image.getInputStream(), filePath);

            return ResponseEntity.ok(filePath.toString());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Image upload failed");
        }}

    // 5️⃣ CITIZEN VIEWS OWN REPORTS
    @GetMapping("/my")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<List<ReportDTO>> getMyReports(Authentication authentication) {

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Long citizenId = principal.getUserId();

        return ResponseEntity.ok(
            reportService.getReportsByCitizen(citizenId)
        );
    }

    // 6️⃣ ADMIN MONITORING
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportDTO>> getAllReports() {

        return ResponseEntity.ok(
                reportService.getAllReports());
    }
}
