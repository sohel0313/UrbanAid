package com.project.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Notification extends BaseEntity {

    @Column(nullable = false, length = 300)
    private String message;

    @CreationTimestamp
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType recipientType;
    // CITIZEN / VOLUNTEER / NGO / GOVERNMENT

    @Column(nullable = false)
    private Long recipientId;
    // User ID or Volunteer ID depending on type

    @Column(nullable = true)
    private Long reportId;  
    // optional: used when notification is linked to a report (status change, comment, assignment)

    @Enumerated(EnumType.STRING)
    private NotificationType type;
    // INFO, ASSIGNMENT, STATUS_CHANGE, COMMENT, ALERT
}
