package com.project.controller;

import com.project.dto.AlertRequestDto;
import com.project.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @PostMapping
    public ResponseEntity<String> raiseAlert(
            @RequestBody AlertRequestDto request) {

        alertService.handleAlert(request);
        return ResponseEntity.ok("Nearby volunteers alerted successfully");
    }
}
