package com.project.dto;

import java.time.LocalDateTime;

import com.project.entities.NotificationType;
import com.project.entities.UserType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationDTO {

    private Long id;

    @NotBlank(message = "Notification message is required")
    private String message;

    private LocalDateTime timestamp;

    @NotNull(message = "Recipient type is required")
    private UserType recipientType;

    @NotNull(message = "Recipient ID is required")
    private Long recipientId;

    private Long reportId;

    @NotNull(message = "Notification type is required")
    private NotificationType type;
}
