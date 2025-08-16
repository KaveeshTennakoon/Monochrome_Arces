package com.monochrome.Backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.Set;

@Data
public class RegisterRequest {

    @NotBlank
    private String username;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank
    private String name;

    private String department;

    // Role is optional but must be ADMIN for this endpoint
    private String role;

    // Permissions (accesses) to assign to the new admin
    private Set<String> permissions;
}
