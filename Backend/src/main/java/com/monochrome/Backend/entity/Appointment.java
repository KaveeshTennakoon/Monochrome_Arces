package com.monochrome.Backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String appointmentType;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String timeslot;

    @Column(nullable = false, unique = true)
    private String referenceId;

    @Builder.Default
    private String status = "pending";

    @Builder.Default
    private Instant createdAt = Instant.now();
}
