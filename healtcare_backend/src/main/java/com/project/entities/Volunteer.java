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

@Getter
@Setter
@Entity
public class Volunteer extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Vtype vtype;  // ROLE_NGO / ROLE_VOLUNTEER / ROLE_GOVERNMENT

    @Column(nullable = false, length = 100)
    private String area;

    @Column(nullable = false, length = 200)
    private String location;

    @Column(nullable = false)
    private boolean availability;

    @Column(length = 200)
    private String skill;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false) 
    @Cascade(CascadeType.ALL)
    private User myuser;
}
