package com.project.dto;

import com.project.entities.Category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReportDTO {

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 500, message = "Description must be 10–500 characters")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;
    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;


    private String imagepath;

    @NotNull(message = "Category is required")
    private Category category;
}
