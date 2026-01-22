package com.project.dto;

import com.project.entities.Status;
import com.project.entities.UserType;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusUpdateDTO {

    @NotNull(message = "Report ID is required")
    private Long reportId;

    @NotNull(message = "New status is required")
    private Status newStatus;

    @NotNull(message = "ChangedByType is required")
    private UserType changedByType;

    @NotNull(message = "ChangedById is required")
    private Long changedById;
}
