package com.monochrome.Backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.monochrome.Backend.dto.AppointmentCreateRequest;
import com.monochrome.Backend.dto.AppointmentResponse;
import com.monochrome.Backend.entity.Appointment;
import com.monochrome.Backend.entity.User;
import com.monochrome.Backend.repository.AppointmentRepository;
import com.monochrome.Backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    @Transactional
    public AppointmentResponse create(AppointmentCreateRequest req) {
        User user = getCurrentUser();
        String ref = "APT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Appointment ap = Appointment.builder()
                .user(user)
                .appointmentType(req.getAppointmentType())
                .date(req.getDate())
                .timeslot(req.getTimeslot())
                .referenceId(ref)
                .status("pending")
                .build();
        appointmentRepository.save(ap);
        return toResp(ap);
    }

    public List<AppointmentResponse> upcoming() {
        User user = getCurrentUser();
        LocalDate today = LocalDate.now();
        return appointmentRepository
                .findByUserAndDateGreaterThanEqualOrderByDateAsc(user, today)
                .stream().map(this::toResp).collect(Collectors.toList());
    }

    private AppointmentResponse toResp(Appointment ap) {
        return AppointmentResponse.builder()
                .referenceId(ap.getReferenceId())
                .appointmentType(ap.getAppointmentType())
                .date(ap.getDate())
                .timeslot(ap.getTimeslot())
                .status(ap.getStatus())
                .build();
    }
}
