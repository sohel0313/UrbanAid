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
}
