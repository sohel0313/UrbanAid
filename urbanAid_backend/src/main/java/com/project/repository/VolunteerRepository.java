package com.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entities.Volunteer;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {

    // Find volunteer by id
    Optional<Volunteer> findByMyuserId(Long userId);

    // find available volunteers
    Optional<Volunteer> findByMyuserEmail(String email);
}
