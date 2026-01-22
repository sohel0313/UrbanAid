package com.project.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class TaskHistory extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status newStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType changedByType; // VOLUNTEER / CITIZEN / GOVT

    @Column(nullable = false)
    private Long changedById;

    @CreationTimestamp
    private LocalDateTime changedAt;
}
