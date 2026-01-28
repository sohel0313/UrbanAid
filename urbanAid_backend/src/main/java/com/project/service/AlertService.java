package com.project.service;

import com.project.dto.AlertRequestDto;
import com.project.entities.Volunteer;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    private final VolunteerService volunteerService;
    private final EmailService emailService;

    public AlertService(VolunteerService volunteerService,
                        EmailService emailService) {
        this.volunteerService = volunteerService;
        this.emailService = emailService;
    }

    public void handleAlert(AlertRequestDto request) {

        List<Volunteer> nearbyVolunteers =
                volunteerService.findNearby(
                        request.getLatitude(),
                        request.getLongitude()
                );

        for (Volunteer v : nearbyVolunteers) {
            emailService.send(
                    v.getMyuser().getEmail(),
                    "🚨 Alert Nearby",
                    "A " + request.getType()
                            + " alert has been raised near your location. Please respond if available."
            );
        }
    }
}
