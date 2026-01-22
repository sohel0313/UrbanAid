package com.project.dto;

import java.util.Date;

import com.project.entities.UserType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

    private Long id;

    @NotBlank
    private String email;

    @NotBlank
    private String mobile;

    private String bio;

    @NotBlank
    private String name;

    private Date dob;

    @NotNull
    private UserType userType;
}
