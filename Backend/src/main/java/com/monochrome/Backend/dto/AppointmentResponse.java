package com.monochrome.Backend.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentResponse {
    private String referenceId;
    private String appointmentType;
    private LocalDate date;
    private String timeslot;
    private String status;
}
