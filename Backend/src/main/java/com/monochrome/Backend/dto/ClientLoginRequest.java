package com.monochrome.Backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClientLoginRequest {
    // Clients can login using email or NIC

    private String email; // optional
    private String nic;   // optional

    @NotBlank
    private String password;
}
