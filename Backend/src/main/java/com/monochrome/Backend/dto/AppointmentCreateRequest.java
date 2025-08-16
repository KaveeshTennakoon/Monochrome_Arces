package com.monochrome.Backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AppointmentCreateRequest {
    @NotBlank
    private String appointmentType;

    @NotNull
    private LocalDate date; // ISO date from frontend

    @NotBlank
    private String timeslot; // e.g., "09:00 AM – 09:30 AM"
}
