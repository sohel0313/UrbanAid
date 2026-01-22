package com.project.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Report extends BaseEntity {

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false, length = 200)
    private String location;

    @Column(nullable = false, length = 500)
    private String imagePath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)    
    @Column(nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @ManyToOne
    @JoinColumn(name = "volunteer_id")
    private Volunteer volunteer;  // nullable before assignment
}
