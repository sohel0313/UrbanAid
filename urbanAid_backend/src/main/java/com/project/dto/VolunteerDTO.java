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

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Availability must be specified")
    private Boolean availability;

    @NotBlank(message = "Skill is required")
    private String skill;

    @NotNull(message = "User ID is required")
    private Long userId;
}
