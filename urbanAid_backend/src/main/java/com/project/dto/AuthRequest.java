package com.project.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AuthRequest {
	@NotBlank(message = "Email is required!")
	@Email(message = "Invalid Email Format")
	private String email;
	@NotBlank(message = "Password is required")
	@Size(min = 5, max = 20, message = "Password must be 5–20 characters")
	private String password;
}
