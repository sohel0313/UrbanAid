package com.project.dto;

import java.time.LocalDateTime;

import com.project.entities.UserType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDTO {

    private Long id;

    @NotBlank(message = "Comment text is required")
    @Size(max = 500, message = "Comment can be max 500 characters")
    private String text;

    private LocalDateTime timestamp;

    @NotNull(message = "Report ID is required")
    private Long reportId;

    @NotNull(message = "Author type is required")
    private UserType authorType;

    @NotNull(message = "Author ID is required")
    private Long authorId;
}
