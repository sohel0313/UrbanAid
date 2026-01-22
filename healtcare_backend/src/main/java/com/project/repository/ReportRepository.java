package com.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entities.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {

}
