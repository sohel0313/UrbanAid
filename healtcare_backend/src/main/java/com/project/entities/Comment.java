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
public class Comment extends BaseEntity {

    @Column(nullable = false, length = 500)
    private String text;

    @CreationTimestamp
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    // Who commented (citizen or volunteer)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType authorType; 
    // CITIZEN / VOLUNTEER / NGO / GOVERNMENT

    @Column(nullable = false)
    private Long authorId; 
    // ID from User or Volunteer table depending on authorType
}
