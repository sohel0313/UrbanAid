package com.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.entities.Category;
import com.project.entities.Status;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportDTO {

    private Long id;

    private String description;
    private String location;
//    @JsonProperty("image_path")
    private String imagepath;
    @NotNull
    private Status status;

    @NotNull
    private Category category;

    private Long citizenId;
    private Long volunteerId;
}
