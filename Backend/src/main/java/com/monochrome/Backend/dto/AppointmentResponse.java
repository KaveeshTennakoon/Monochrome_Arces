package com.monochrome.Backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
