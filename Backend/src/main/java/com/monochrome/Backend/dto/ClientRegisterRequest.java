package com.monochrome.Backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ClientRegisterRequest {

    @NotBlank
    @JsonAlias({"name"})
    private String fullName;

    @NotBlank
    @Size(min = 10, max = 12)
    private String nic;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;
}
