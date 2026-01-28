package com.project.entities;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Volunteer extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Vtype vtype;  
    // ROLE_VOLUNTEER / ROLE_NGO / ROLE_GOVERNMENT

    @Column(nullable = false, length = 100)
    private String area;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private boolean availability;

    @Column(length = 200)
    private String skill;

    /**
     * Volunteer can CREATE a User,
     * but must NOT control User lifecycle.
     * Hence CascadeType.PERSIST only.
     */
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @Cascade(CascadeType.PERSIST)
    private User myuser;
}
