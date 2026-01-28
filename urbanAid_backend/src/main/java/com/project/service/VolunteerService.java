package com.project.service;

import java.util.List;

import com.project.dto.VolunteerDTO;
import com.project.entities.Volunteer;

public interface VolunteerService {

    VolunteerDTO registerVolunteer(VolunteerDTO dto);

    VolunteerDTO getVolunteerById(Long id);

    VolunteerDTO getVolunteerByUserId(Long userId);

    List<VolunteerDTO> listAllVolunteers();

    VolunteerDTO updateAvailability(Long volunteerId, boolean availability);
    List<Volunteer> findNearby(double lat, double lon);
}
