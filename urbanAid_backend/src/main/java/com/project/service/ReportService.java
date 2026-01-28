package com.project.service;

import java.util.List;

import com.project.dto.CreateReportDTO;
import com.project.dto.ReportDTO;
import com.project.entities.Status;

public interface ReportService {

    // Citizen
    ReportDTO createReport(CreateReportDTO dto, Long citizenId);
    List<ReportDTO> getReportsByCitizen(Long citizenId);

    // Volunteer
    List<ReportDTO> getNearbyUnassignedReports(Long volunteerId);
    ReportDTO claimReport(Long reportId, Long volunteerId);
    ReportDTO updateReportStatus(Long reportId, Status status, Long volunteerId);

    // Admin
    List<ReportDTO> getAllReports();
}
