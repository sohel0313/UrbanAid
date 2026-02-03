package com.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.entities.Report;
import com.project.entities.Status;

public interface ReportRepository extends JpaRepository<Report, Long> {

    // Citizen
    List<Report> findByCitizenId(Long citizenId);

    // NEARBY REPORTS USING ST_Distance_Sphere
    @Query(value = """
        SELECT * FROM report r
        WHERE r.status = :status
        AND ST_Distance_Sphere(
            POINT(r.longitude, r.latitude),
            POINT(:lng, :lat)
        ) <= :radius
        """, nativeQuery = true)
    List<Report> findNearbyReports(
            @Param("status") String status,
            @Param("lat") Double latitude,
            @Param("lng") Double longitude,
            @Param("radius") Double radius
    );

    // Conditional assign: update only if status is CREATED to avoid races
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Report r SET r.volunteer = :volunteer, r.status = :assigned WHERE r.id = :id AND r.status = :expected")
    int assignIfStatus(@org.springframework.data.repository.query.Param("id") Long id,
                       @org.springframework.data.repository.query.Param("volunteer") com.project.entities.Volunteer volunteer,
                       @org.springframework.data.repository.query.Param("assigned") com.project.entities.Status assigned,
                       @org.springframework.data.repository.query.Param("expected") com.project.entities.Status expected);

    // Reports assigned to a volunteer (by volunteer entity id)
    List<Report> findByVolunteerId(Long volunteerId);

}
