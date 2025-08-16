package com.monochrome.Backend.dto;

import com.monochrome.Backend.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    private String department;

    @NotNull
    private Role role;

    @NotBlank
    @Size(min = 6)
    private String password;
}
