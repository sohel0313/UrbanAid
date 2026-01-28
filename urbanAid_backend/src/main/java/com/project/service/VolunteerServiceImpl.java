package com.project.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.custom_exceptions.InvalidInputException;
import com.project.custom_exceptions.ResourceNotFoundException;
import com.project.dto.VolunteerDTO;
import com.project.entities.User;
import com.project.entities.UserType;
import com.project.entities.Volunteer;
import com.project.repository.VolunteerRepository;
import com.project.util.DistanceUtil;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class VolunteerServiceImpl implements VolunteerService {

    private final DistanceUtil distanceUtil;

    private final VolunteerRepository volunteerRepo;
    private final ModelMapper mapper;
    private final PasswordEncoder passwordEncoder;


    // 1️ Register Volunteer (Creates User + Volunteer)
    @Override
    public VolunteerDTO registerVolunteer(VolunteerDTO dto) {
        if (dto.getUser() == null) {
            throw new InvalidInputException("User details are required");
        }

        // 1. Create and encrypt the User
        User user = mapper.map(dto.getUser(), User.class);
        user.setUserType(UserType.ROLE_VOLUNTEER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 2. Map the Volunteer (this brings in latitude, vtype, area, etc.)
        Volunteer volunteer = mapper.map(dto, Volunteer.class);
        
        // 3. Manually link the User to the 'myuser' field in your Entity
        volunteer.setMyuser(user); 

        // 4. Save (Cascade PERSIST handles saving the 'user' entity automatically)
        Volunteer savedVolunteer = volunteerRepo.save(volunteer);

        // 5. Return the saved object mapped back to DTO
        return mapper.map(savedVolunteer, VolunteerDTO.class);
    }
    // 2️ Get Volunteer by ID
    @Override
    public VolunteerDTO getVolunteerById(Long id) {

        Volunteer volunteer = volunteerRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Volunteer not found"));

        return mapper.map(volunteer, VolunteerDTO.class);
    }

    // 3️ Get Volunteer by User ID
    @Override
    public VolunteerDTO getVolunteerByUserId(Long userId) {

        Volunteer volunteer = volunteerRepo.findByMyuserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Volunteer not found for user"));

        return mapper.map(volunteer, VolunteerDTO.class);
    }

    // 4️ List all Volunteers
    @Override
    public List<VolunteerDTO> listAllVolunteers() {

        return volunteerRepo.findAll()
                .stream()
                .map(v -> mapper.map(v, VolunteerDTO.class))
                .toList();
    }

    
    
    
    // 5️ Update Volunteer Availability
    @Override
    public VolunteerDTO updateAvailability(Long volunteerId, boolean availability) {

        Volunteer volunteer = volunteerRepo.findById(volunteerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Volunteer not found"));

        volunteer.setAvailability(availability);

        return mapper.map(volunteerRepo.save(volunteer), VolunteerDTO.class);
    }
    
    
    @Override
    public List<Volunteer> findNearby(double lat, double lon) {

        return volunteerRepo.findAll()
                .stream()
                .filter(v ->
                        distanceUtil.calculate(
                                lat, lon,
                                v.getLatitude(), v.getLongitude()
                        ) <= 5
                )
                .toList();
    }
}
