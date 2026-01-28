package com.project.controller;


import com.project.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test-email")
public class TestEmailController {

    private final EmailService emailService;

    public TestEmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping
    public ResponseEntity<String> sendTestMail() {

        emailService.send(
                "mosohelshaikh0313@gmail.com",
                "UrbanAid Test Mail",
                "Email configuration is working successfully!"
        );

        return ResponseEntity.ok("Test email sent successfully");
    }
}

