package com.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entities.Volunteer;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {

}
