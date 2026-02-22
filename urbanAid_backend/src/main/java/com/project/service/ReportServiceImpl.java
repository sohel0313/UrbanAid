package com.project.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.custom_exceptions.AuthenticationFailedException;
import com.project.custom_exceptions.InvalidInputException;
import com.project.custom_exceptions.ResourceConflictException;
import com.project.custom_exceptions.ResourceNotFoundException;
import com.project.dto.AlertRequestDto;
import com.project.dto.CreateReportDTO;
import com.project.dto.ReportDTO;
import com.project.entities.Notification;
import com.project.entities.Report;
import com.project.entities.Status;
import com.project.entities.User;
import com.project.entities.UserType;
import com.project.entities.Volunteer;
import com.project.repository.NotificationRepository;
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
    private final NotificationRepository notificationRepo;
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
        // Ensure imagepath isn't null to avoid DB constraint issues
        if (report.getImagepath() == null) {
            report.setImagepath("");
        }
        
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

        Volunteer volunteer = volunteerRepo.findByMyuserId(volunteerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Volunteer not found"));

        if (!volunteer.isAvailability()) {
            throw new InvalidInputException("Volunteer not available");
        }

        // Use a conditional update to make the claim operation race-safe. The repository
        // executes an UPDATE ... WHERE id=:id AND status=:expected and returns the
        // number of rows affected. If 0 rows were updated, someone else claimed it.
        int updated = reportRepo.assignIfStatus(reportId, volunteer, Status.ASSIGNED, Status.CREATED);
        if (updated == 0) {
            throw new ResourceConflictException("Report already assigned or closed");
        }

        // fetch the updated report and return it
        Report updatedReport = reportRepo.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found after assign"));

        // Create notifications for citizen and volunteer
        try {
            // Message for citizen
            String volName = volunteer.getMyuser() != null ? volunteer.getMyuser().getName() : "A volunteer";
            String citizenMsg = String.format("%s has claimed your report: %s", volName, (updatedReport.getDescription() != null ? updatedReport.getDescription().split("\\n")[0] : "Report"));

            Notification n1 = new com.project.entities.Notification();
            n1.setMessage(citizenMsg);
            n1.setRecipientType(UserType.ROLE_CITIZEN);
            n1.setRecipientId(updatedReport.getCitizen().getId());
            n1.setReportId(updatedReport.getId());
            n1.setType(com.project.entities.NotificationType.ASSIGNMENT);
            notificationRepo.save(n1);

            // Message for volunteer
            String volunteerMsg = String.format("You have been assigned to: %s", (updatedReport.getDescription() != null ? updatedReport.getDescription().split("\\n")[0] : "Report"));
            Notification n2 = new Notification();
            n2.setMessage(volunteerMsg);
            n2.setRecipientType(UserType.ROLE_VOLUNTEER);
            n2.setRecipientId(volunteer.getId());
            n2.setReportId(updatedReport.getId());
            n2.setType(com.project.entities.NotificationType.ASSIGNMENT);
            notificationRepo.save(n2);

            // Send emails (best-effort)
            try {
                if (updatedReport.getCitizen() != null && updatedReport.getCitizen().getEmail() != null) {
                    emailService.send(updatedReport.getCitizen().getEmail(), "Your report has been claimed", citizenMsg);
                }
                if (volunteer.getMyuser() != null && volunteer.getMyuser().getEmail() != null) {
                    emailService.send(volunteer.getMyuser().getEmail(), "You have a new assignment", volunteerMsg);
                }
            } catch (Exception e) {
                // swallow email errors (non-critical)
                e.printStackTrace();
            }
        } catch (Exception e) {
            // Ensure notifications do not prevent the claim — log and continue
            e.printStackTrace();
        }

        return mapper.map(updatedReport, ReportDTO.class);
    }

    // Reports assigned to a volunteer (by their user id)
    @Override
    public List<ReportDTO> getReportsByVolunteer(Long volunteerMyUserId) {
        Volunteer volunteer = volunteerRepo.findByMyuserId(volunteerMyUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found"));

        List<Report> reports = reportRepo.findByVolunteerId(volunteer.getId());
        return reports.stream().map(r -> mapper.map(r, ReportDTO.class)).toList();
    }

    // Single report lookup
    @Override
    public ReportDTO getReportById(Long reportId) {
        Report report = reportRepo.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        return mapper.map(report, ReportDTO.class);
    }

    // Volunteer updates report status
    @Override
    public ReportDTO updateReportStatus(Long reportId, Status status, Long volunteerId) {

        Report report = reportRepo.findById(reportId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Report not found"));

        if (report.getVolunteer() == null ||
            report.getVolunteer().getMyuser() == null ||
            !report.getVolunteer().getMyuser().getId().equals(volunteerId)) {

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
