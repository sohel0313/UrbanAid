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

    // Reports assigned to a volunteer (by their user id)
    List<ReportDTO> getReportsByVolunteer(Long volunteerMyUserId);

    // Admin
    List<ReportDTO> getAllReports();

    // Single report lookup
    ReportDTO getReportById(Long reportId);
}
