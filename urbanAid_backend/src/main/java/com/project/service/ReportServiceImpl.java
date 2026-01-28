package com.project.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.custom_exceptions.AuthenticationFailedException;
import com.project.custom_exceptions.InvalidInputException;
import com.project.custom_exceptions.ResourceNotFoundException;
import com.project.dto.AlertRequestDto;
import com.project.dto.CreateReportDTO;
import com.project.dto.ReportDTO;
import com.project.entities.Report;
import com.project.entities.Status;
import com.project.entities.User;
import com.project.entities.Volunteer;
import com.project.repository.ReportRepository;
import com.project.repository.UserRepository;
import com.project.repository.VolunteerRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepo;
    private final UserRepository userRepo;
    private final VolunteerRepository volunteerRepo;
    private final ModelMapper mapper;
    private final EmailService emailService;
    private final AlertService alertService;


    private static final double NEARBY_RADIUS_METERS = 5000.0; // 5 KM

    // Citizen creates a report
    @Override
    public ReportDTO createReport(CreateReportDTO dto, Long citizenId) {

        User citizen = userRepo.findById(citizenId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Citizen not found"));

        if (dto.getLocation() == null || dto.getLocation().isBlank()) {
            throw new InvalidInputException("Location cannot be empty");
        }

        Report report = mapper.map(dto, Report.class);
        report.setCitizen(citizen);
        report.setStatus(Status.CREATED);
        
        //send email
        AlertRequestDto dt=new AlertRequestDto();
        dt.setLatitude(dto.getLatitude());
        dt.setLongitude(dto.getLongitude());
        dt.setType(dto.getDescription());
        alertService.handleAlert(dt);
        
        return mapper.map(reportRepo.save(report), ReportDTO.class);
    }

    // Volunteer views nearby unassigned reports 5 KM
    @Override
    public List<ReportDTO> getNearbyUnassignedReports(Long volunteerId) {

        Volunteer volunteer = volunteerRepo.findByMyuserId(volunteerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Volunteer not found"));

        if (!volunteer.isAvailability()) {
            throw new InvalidInputException("Volunteer is not available");
        }

        List<Report> reports = reportRepo.findNearbyReports(
                Status.CREATED.name(),
                volunteer.getLatitude(),
                volunteer.getLongitude(),
                NEARBY_RADIUS_METERS
        );

        return reports.stream()
                .map(r -> mapper.map(r, ReportDTO.class))
                .toList();
    }

    //  Volunteer self-claims a report
    @Override
    public ReportDTO claimReport(Long reportId, Long volunteerId) {

        Volunteer volunteer = volunteerRepo.findById(volunteerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Volunteer not found"));

        if (!volunteer.isAvailability()) {
            throw new InvalidInputException("Volunteer not available");
        }

        Report report = reportRepo.findById(reportId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Report not found"));

        if (report.getStatus() != Status.CREATED) {
            throw new InvalidInputException("Report already assigned or closed");
        }

        // Atomic self-assignment
        report.setVolunteer(volunteer);
        report.setStatus(Status.ASSIGNED);

        return mapper.map(reportRepo.save(report), ReportDTO.class);
    }

    // Volunteer updates report status
    @Override
    public ReportDTO updateReportStatus(Long reportId, Status status, Long volunteerId) {

        Report report = reportRepo.findById(reportId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Report not found"));

        if (report.getVolunteer() == null ||
            !report.getVolunteer().getId().equals(volunteerId)) {

            throw new AuthenticationFailedException(
                    "You are not authorized to update this report");
        }

        if (status == Status.CREATED) {
            throw new InvalidInputException("Invalid status transition");
        }

        report.setStatus(status);

        return mapper.map(reportRepo.save(report), ReportDTO.class);
    }

    //  Citizen views own reports
    @Override
    public List<ReportDTO> getReportsByCitizen(Long citizenId) {

        if (!userRepo.existsById(citizenId)) {
            throw new ResourceNotFoundException("Citizen not found");
        }

        return reportRepo.findByCitizenId(citizenId)
                .stream()
                .map(r -> mapper.map(r, ReportDTO.class))
                .toList();
    }

    // Admin monitoring (read-only)
    @Override
    public List<ReportDTO> getAllReports() {

        return reportRepo.findAll()
                .stream()
                .map(r -> mapper.map(r, ReportDTO.class))
                .toList();
    }
}
