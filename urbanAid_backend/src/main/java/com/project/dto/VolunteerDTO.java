package com.project.dto;

import com.project.entities.Vtype;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VolunteerDTO {

    private Long id;
    private CreateUserDTO user;
    @NotNull(message = "Volunteer type is required")
    private Vtype vtype;

    @NotBlank(message = "Area is required")
    private String area;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Availability must be specified")
    private Boolean availability;

    @NotBlank(message = "Skill is required")
    private String skill;

//    @NotNull(message = "User ID is required")
    private Long userId;
}
